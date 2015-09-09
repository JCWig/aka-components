var render = require('./utils/renderer').render,
  i18n = require('./helpers/i18n');

var internalFooterTpl = require('./footer/internalFooter.hbs'),
  footerTpl = require('./footer/_footer.hbs');

module.exports = function() {

  function Footer(megaMenuData) {
    megaMenuData.fetch().then(renderFooter);
  }

  Footer.$inject = ['megaMenuData'];

  function renderFooter(data) {
    var footerSel = '#modular-mega-menu-footer',
      footerData;

    i18n.setData(data.i18n);

    footerData = {
      currentYear: (new Date()).getFullYear(),
      feedbackUrl: data.partner.feedbackUrl,
      policyUrl: i18n.i18n('policies.' + data.config.locale.toLowerCase()),
      internalLinks: data.internalFooter,
      viewTermsOfService: data.partner.displayTos,
      hideTermsOfService: !data.partner.displayTos
    };

    if (data.internalFooter.length) {
      render(footerSel, internalFooterTpl, footerData);
    } else {
      render(footerSel, footerTpl, footerData);
    }
  }

  return {
    restrict: 'E',
    scope: {},
    controller: Footer,
    controllerAs: 'menuFooter',
    template: '<footer id="modular-mega-menu-footer"></footer>'
  };

};