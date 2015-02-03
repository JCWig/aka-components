'use strict';


function click(el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent('click', true);
    el.dispatchEvent(ev);
};

describe('akamai.components.status-message-service', function() {
    describe('group status messages', function(){
        beforeEach(function() {
            var self = this;
            angular.mock.module(require('../../src/status-message').name);
            
            angular.mock.module(function ($controllerProvider) {
                $controllerProvider.register('Controller', function($scope) {
                });
            });
            inject(function(statusMessage, $rootScope, $timeout, $compile) {
                self.statusMessage = statusMessage;
                self.scope = $rootScope;
                self.timeout = $timeout;
                self.$compile = $compile;
            });
        });
        afterEach(function(){
            var wrapper = document.querySelector('.akam-status-message-wrapper');
            if(wrapper){
                wrapper.parentNode.removeChild(wrapper);   
            }
        });
        context('when rendering', function(){
            afterEach(function(){
                var wrapper = document.querySelector('.akam-status-message-wrapper');
                if(wrapper){
                    wrapper.parentNode.removeChild(wrapper);   
                }
            });
            it('should display correct information with success', function(){ 
                this.statusMessage.showSuccess({text : "message_text", timeout: 2000});
                this.scope.$digest();
                expect(document.querySelector('.akam-status-message-item').classList.contains('success')).to.be.true;;
                expect(document.querySelector('#akam-status-message-1')).to.not.be.null;
                expect(document.querySelectorAll('.status-message-content')[0].textContent).to.equal('\n        message_text\n    ');
            });
            it('should display correct information with info', function(){ 
                this.statusMessage.showInfo({text : "message_text2",statustype:"info"});
                this.scope.$digest();
                expect(document.querySelector('.akam-status-message-item').classList.contains('info')).to.be.true;;
                expect(document.querySelector('#akam-status-message-1')).to.not.be.null;
                expect(document.querySelectorAll('.status-message-content')[0].textContent).to.equal('\n        message_text2\n    ');
            });
            it('should display correct information with error', function(){ 
                this.statusMessage.showError({text : "message_text3", timeout: 2000, statustype:"error"});
                this.scope.$digest();
                expect(document.querySelector('.akam-status-message-item').classList.contains('error')).to.be.true;
                expect(document.querySelector('#akam-status-message-1')).to.not.be.null;
                expect(document.querySelectorAll('.status-message-content')[0].textContent).to.equal('\n        message_text3\n    ');
            });
            it('should display correct information with warning', function(){ 
                this.statusMessage.showWarning({text : "message_text4", timeout: 2000, statustype:"warning"});
                this.scope.$digest();
                expect(document.querySelector('.akam-status-message-item').classList.contains('warning')).to.be.true;
                expect(document.querySelector('#akam-status-message-1')).to.not.be.null;
                expect(document.querySelectorAll('.status-message-content')[0].textContent).to.equal('\n        message_text4\n    ');
            });
        }); 
        context('when rendered', function(){
            it('should disappear after timeout', function(){
                this.statusMessage.showSuccess({text : "message_text", timeout: 2000});
                this.scope.$digest();
                expect(document.querySelector('div.status-message-content')).to.not.be.null
                this.timeout.flush();
                this.timeout.flush();
                expect(document.querySelector('.status-message-content')).to.be.null;
            });
            it('should disappear when close is clicked', function(){
                this.statusMessage.showSuccess({text : "message_text", timeout: 100000});
                this.scope.$digest();
                expect(document.querySelector('div.status-message-content')).to.not.be.null
                click(document.querySelector('i.close'));
                this.timeout.flush();
                expect(document.querySelector('.status-message-content')).to.be.null; 
            });
            it('should close after mouse enters and leaves', function(){
                this.statusMessage.showError({text : "message_text6", timeout: 2000, statustype:"error"});
                this.scope.$digest();
                var ev = document.createEvent('MouseEvent');
                ev.initMouseEvent('mouseover', true);
                var ev2 = document.createEvent('MouseEvent');
                ev2.initMouseEvent('mouseout', true);
                document.querySelector('.akam-status-message-item').dispatchEvent(ev);
                document.querySelector('.akam-status-message-item').dispatchEvent(ev2);
                this.timeout.flush();
                this.timeout.flush();
                expect(document.querySelector('.status-message-content')).to.be.null;  
            });
            it('should stay open while mouse is hovering', function(){
                this.statusMessage.showError({text : "message_text6", timeout: 2000, statustype:"error"});
                this.scope.$digest();
                var ev = document.createEvent('MouseEvent');
                ev.initMouseEvent('mouseover', true);
                var ev2 = document.createEvent('MouseEvent');
                ev2.initMouseEvent('mouseout', true);
                document.querySelector('.akam-status-message-item').dispatchEvent(ev);
                expect(this.timeout.verifyNoPendingTasks()).to.be.undefined;
            });
        });
    });
});
