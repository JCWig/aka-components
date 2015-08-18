import angular from 'angular';
import template from './templates/modal-window.tpl.html';

class ModalWindowService {

  constructor($modal, $templateCache, $rootScope, $q, translate, statusMessage) {
    this.$modal = $modal;
    this.$templateCache = $templateCache;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.translate = translate;
    this.statusMessage = statusMessage;
  }

  /**
   * @ngdoc method
   *
   * @name modalWindow#open
   *
   * @description Opens a new modal window.
   *
   * @param {object} options A hash with the options specified below.
   *
   * @param {string} [options.cancelLabel=Cancel] A label for
   * the cancel button.
   *
   * @param {Function|string} options.controller A controller
   * for the modal instance that can initialize scope.
   *
   * @param {boolean} [options.hideSubmit=false] A flag to hide
   * the submit button and only allow the modal to be dismissed.
   *
   * @param {string} options.icon A CSS class representing an
   * icon to display to the left of the modal window title.
   *
   * @param {Scope} [options.scope=$rootScope] A scope
   * instance to use for the modal body content.
   *
   * @param {string} [options.submitLabel=Save] A label for the
   * submit button.
   *
   * @param {string} options.template An inline template to
   * render within the body of the modal window.
   *
   * @param {string} options.templateUrl A URL referencing a
   * template to render within the body of the modal window.
   *
   * @param {string} [options.title=Modal Window Title] A
   * title for the modal window.
   *
   * @return {object} An instance of the modal with the following
   * properties:
   *
   * - `close` (Function) A method to close the modal window
   *   that accepts a result as an argument.
   *
   * - `dismiss` (Function) A method to dismiss the modal
   *   window, rejecting the `result` promise.
   *
   * - `result` (Promise) A promise representing the result
   *   when the modal window is closed.
   *
   */
  open(options) {
    let scope = (options.scope || this.$rootScope).$new(),
      onSubmit = angular.noop,
      disabled = false,
    //variable used to determine if the submit is clicked, but promise has not resolved
      processing = false,
      instance,
      $q = this.$q,
      statusMessage = this.statusMessage;

    scope.showSubmitError = false;

    // check that a template was provided
    if (!(angular.isDefined(options.template) ||
      angular.isDefined(options.templateUrl))) {
      throw new Error('Modal Window template or templateUrl option required');
    }

    // setup options specific for the modal window
    scope.modalWindow = {
      title: options.title || this.translate.sync('components.modal-window.title'),
      icon: options.icon,
      cancelLabel: options.cancelLabel ||
      this.translate.sync('components.modal-window.label.cancel'),
      submitLabel: options.submitLabel ||
      this.translate.sync('components.modal-window.label.save'),
      template: options.template,
      templateUrl: options.templateUrl,
      errorMessage: options.errorMessage ||
      this.translate.sync('components.modal-window.errorMessage'),
      successMessage: options.successMessage ||
      this.translate.sync('components.modal-window.successMessage')
    };

    scope.isSubmitHidden = function() {
      return angular.isDefined(options.hideSubmit) ?
        options.hideSubmit : false;
    };

    // provide methods to control submit button disabled state
    scope.disableSubmit = function() {
      disabled = true;
    };
    scope.enableSubmit = function() {
      disabled = false;
    };
    scope.isSubmitDisabled = function() {
      return disabled || processing;
    };

    scope.isProcessing = function() {
      return processing;
    };

    // create a new bootstrap ui modal instance with akamai options
    instance = this.$modal.open(angular.extend(options, {
      scope: scope,
      template: template
    }));

    scope.close = function() {
      instance.dismiss();
    };

    // setup promise that will resolve when submit button is clicked
    scope.setOnSubmit = function(fn) {
      onSubmit = fn;
    };

    scope.submit = function() {
      let result;

      scope.showSubmitError = false;

      if (angular.isFunction(onSubmit)) {
        result = onSubmit();
      } else {
        result = onSubmit;
      }

      // check to see if the onSubmit returns a promise
      if (result && angular.isFunction(result.then)) {
        processing = true;
      }

      $q.when(result).then(
        function(returnValue) {
          instance.close(returnValue);
          if (!options.doNotShowMessage) {
            statusMessage.showSuccess({text: scope.modalWindow.successMessage});
          }
        }
      ).catch(
        function() {
          processing = false;
          scope.showSubmitError = true;
        }
      );
    };
    return instance;
  }

}

function ModalWindowServiceFactory($modal, $templateCache, $rootScope, $q, translate,
                                   statusMessage) {
  return new ModalWindowService($modal, $templateCache, $rootScope, $q, translate, statusMessage);
}

ModalWindowServiceFactory.$inject = ['$modal', '$templateCache', '$rootScope', '$q', 'translate',
                                     'statusMessage'];

export default ModalWindowServiceFactory;
