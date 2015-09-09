import angular from 'angular';
import DropdownTemplate from './dropdown-template';

export default class DropdownMenuTemplate extends DropdownTemplate {
  constructor(ctrl) {
    super(ctrl, 'option', ctrl.templateData.menu);
  }

  set filterPlaceholder(newFilterPlaceholder) {
    if (angular.isDefined(this.scope)) {
      this.scope.dropdown.filterPlaceholder = newFilterPlaceholder;
    }
  }

  render() {
    let compiledTemplate = super.render();

    if (this.ctrl.appendToBody) {
      this.ctrl.appendToBodyService.appendToBody(this.elem, compiledTemplate,
        () => {
          this.ctrl.$scope.$watch('dropdown.isOpen', (isOpen) => {
            compiledTemplate.toggleClass('util-show', isOpen);
            compiledTemplate.toggleClass('util-hide', !isOpen);
            this.ctrl.initFilterClick();
          });
        }
      );
    } else {
      this.elem.children(0).append(compiledTemplate);
    }
  }
}
