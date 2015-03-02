'use strict';
var utilities = require('../utilities');
var FILTER_BOX = 'div.filter input[type="search"]';
var ALL_CHECKED_CHECKBOXES = 'input[type="checkbox"]:checked';
var TABLE_COLUMN_HEADER = '.akam-data-table thead tr th';
var TABLE_ROW = 'div.akam-data-table tbody tr';

var PREVIOUS_BUTTON = 'div.akam-pagination .pagination li:first-child';
var NEXT_BUTTON = 'div.akam-pagination .pagination li:last-child'
var TOTAL_ITEMS_SPAN = 'div.akam-pagination .total-items';
var PAGINATION_PAGE_ONE = 'div.akam-pagination .pagination li:first-child';
var PAGINATION_INDEX_NTH =  'div.akam-pagination .pagination li:nth-child';
var PAGINATION_INDEX_REVERSE =  'div.akam-pagination .pagination li:nth-last-child';
var PAGE_SIZE_SMALLEST = 'div.akam-pagination .page-size li:first-child';
var PAGE_SIZE_LARGEST = 'div.akam-pagination .page-size li:last-child';
var PAGE_SIZE_NTH = 'div.akam-pagination .page-size li:nth-child';
var PAGE_SIZES= 'div.akam-pagination .page-size li'


describe('zakam-data-table', function() {
    var compile = null;
    var scope = null;
    var self = this;
    var q = null;
    var timeout = null;
    var http = null;

    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/data-table').name);
        angular.mock.module(function($provide, $translateProvider) {
            $provide.factory('i18nCustomLoader', function($q, $timeout) {
                return function(options) {
                    var deferred = $q.defer();
                    $timeout(function() {
                        deferred.resolve(translationMock);
                    });
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function($compile, $rootScope, $q, $timeout, $http) {
            compile = $compile;
            scope = $rootScope.$new();
            q = $q;
            timeout = $timeout;
            http = $http;
        });
        scope.mydata = [
            {
                first : 'Oliver',
                last : 'Queen',
                id : 11,
                bu : "Justice League",
                color: "Green",
                birthday : new Date(2001,10,20),
                generic : ["seriously whats wrong with arrow cave?"]
            },
            {
                first : "Roy",
                last: "Harper",
                id : 20,
                bu : "Teen Titans",
                color:"Red",
                birthday : new Date(2002,10,20),
                generic : ["shoot em up"]
            },
            {
                first: "Dinah",
                last:"Lance",
                id: 12,
                bu:"Birds of Prey",
                color:"Black",
                birthday : new Date(2000,10,20),
                generic : ["AAAAAAAAAAAAAAAAAAA"]
            }
        ];
        scope.columns = [
            {
                content : function(){
                    return this.first + ' ' + this.last;
                },
                header : 'Full Name',
                className : 'column-full-text-name'
            },
            {
                content : 'id',
                header : 'ID'
            },
            {
                content:"color",
                header:"Favorite Color",
                sort: function(){
                    var colorsValues = {
                        'Red' : 1,
                        'Black' : 2,
                        'Green' : 3
                    };
                    return colorsValues[this.color];
                }
            },
            {
                content:"birthday",
                header:"Birthday"
            },
            {
                content:"generic",
                header:"Generic Sorting"
            }
        ];
        scope.mybigdata = require('./bigTestingData/thousandUsers');
        scope.bigcolumns = [
            {
                content : function(){
                    return this.first_name + ' ' + this.last_name;
                },
                header : 'Full Name',
                className : 'column-full-name'
            },
            {
                content : 'id',
                header : 'Emp. ID',
                className : 'column-employeeid'
            }
        ];
    });
    function addElement(markup) {
        self.el = compile(markup)(scope);
        self.element = self.el[0];
        scope.$digest();
        document.body.appendChild(self.element);
    };
    context('when rendering data table', function() {
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        /*it('should show progress bar until fully rendered', function(){
            var deferred = q.defer();
            scope.delayeddata = deferred.promise;
            timeout(function(){
                deferred.resolve(scope.mydata);
            }, 2000);
            var markup = '<akam-data-table data="delayeddata" schema="columns"></akam-data-table>';
            addElement(markup);

            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/false/);
            timeout.flush();
            var allRowsLoadedInTable = document.querySelectorAll(TABLE_ROW);

            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/true/);
            expect(allRowsLoadedInTable).to.have.length(scope.mydata.length);
        });*/
        it('should render all parts data table and pagination', function() {
            var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>'
            addElement(markup);

            var dataTableContainer = document.querySelector('div.akam-data-table');
            var paginationContainer = document.querySelector('div.akam-pagination');

            expect(dataTableContainer).to.not.be.null;
            expect(paginationContainer).to.not.be.null;
        });
        //it('should not have anything selected if checkboxes are active', function() {});
        it('should have filter be clear', function() {
            var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>'
            addElement(markup);

            var filterBox = document.querySelector(FILTER_BOX);

            expect(filterBox.value).to.equal('');
        });
        it('should have 3 options for how many rows are displayed', function(){
            var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>'
            addElement(markup);

            var smallestPageSize = document.querySelector(PAGE_SIZE_SMALLEST);
            var mediumPageSize = document.querySelector(PAGE_SIZE_NTH+'(2)');
            var largestPageSize = document.querySelector(PAGE_SIZE_LARGEST);

            expect(smallestPageSize.textContent).to.match(/10/);
            expect(mediumPageSize.textContent).to.match(/25/);
            expect(largestPageSize.textContent).to.match(/50/);
        });

    });
    context('when data table is rendered', function(){
        afterEach(function(){
            document.body.removeChild(this.element);
        });
        it('should display the total number of results', function(){
            var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>'
            addElement(markup);

            var totalItemsSpan = document.querySelector(TOTAL_ITEMS_SPAN);

            expect(totalItemsSpan.textContent).to.contain('3');
        });
        //it('should display action options on mouse hover of a row', function(){});
        //it('should show indeterminate progress bar when refreshed', function(){});
    });
    /*context('when data table is loaded', function(){
        it('should be able to render without a toolbar', function(){});
        it('should be able to render without bulk delete', function(){});
        it('should be able to render without filter', function(){});
        it('should be able to render without export', function(){});
        it('should be able to render with only bulk delete', function(){});
        it('should be able to render with only export', function(){});
        it('should be able to render with only filter', function(){});
    });
    context('when rendered with bulk actions', function(){
        it('should be rendered with checkboxes column', function(){});
        it('should be able to select an item', function(){});
        it('should be able to deselect an item', function(){});
    });
    context('when data table is given below minimum columns (6)', function(){
    });
    context('when data table is given above maximum columns (12)', function(){
    });
    context('when selecting an item', function(){
        it('should update selected checkbox', function(){});
        it('should change background color of selected items', function(){});
    });
    context('when deselecting an item', function(){
        it('should update deselected checkbox', function(){});
        it('should change background color of deselected items', function(){});
    });*/
    context('when rendered with checkboxes', function(){
        beforeEach(function(){
            var markup = '<akam-data-table data="mybigdata" schema="bigcolumns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
        });
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should show checkboxes for each row', function(){
            expect(document.querySelectorAll(TABLE_ROW).length).to.equal(10);
        });
        it('should add checkboxes for each row when page size changes', function(){
            var largestPageSize = document.querySelector(PAGE_SIZE_LARGEST).querySelector('a');
            utilities.click(largestPageSize);
            scope.$digest();
            expect(document.querySelectorAll(TABLE_ROW).length).to.equal(50);
        });
        it('should be able to select items', function(){
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            utilities.click(rowOneColumnTwo);
            scope.$digest();

            expect(scope.$$childTail.selectedItems.length).to.equal(1);
        });
        it('should be able to deselect items', function(){
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            utilities.click(rowOneColumnTwo);
            scope.$digest();
            utilities.click(rowOneColumnTwo);

            expect(scope.$$childTail.selectedItems.length).to.equal(0); 
        });
        it('should be able to view selected only items', function(){
            //CURRENTY NOT ACTUALLY IMPLEMENTED ACCESSING FIELD DIRECTLY TO TEST 
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];
            utilities.click(rowOneColumnTwo);
            utilities.click(rowThreeColumnOne);

            scope.$$childTail.state.viewSelectedOnly = true;
            scope.$$childTail.updateSearchFilter();
            scope.$digest();
            
            expect(document.querySelectorAll(TABLE_ROW).length).to.equal(2);
        });
    });
    context('when interacting with sort options', function(){
        beforeEach(function(){
            var markup = '<akam-data-table data="mydata" schema="columns"></akam-data-table>';
            addElement(markup);
        });
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should be able to sort alphabetically', function() {
            var sortByColumnOneAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[0];
            utilities.click(sortByColumnOneAlphabectically);
            utilities.click(sortByColumnOneAlphabectically);

            var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];

            expect(rowOneColumnOne.textContent).to.match(/Dinah Lance/);
            expect(rowThreeColumnOne.textContent).to.match(/Roy Harper/);
        });
        it('should be able to sort reverse-alphabetically', function() {
            var sortByColumnOneAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[0];
            utilities.click(sortByColumnOneAlphabectically);

            var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];

            expect(rowOneColumnOne.textContent).to.match(/Roy Harper/);
            expect(rowThreeColumnOne.textContent).to.match(/Dinah Lance/);
        });
        it('should be able to sort numerically', function(){
            var sortByColumnTwoNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwoNumerically);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/11/);
            expect(rowThreeColumnTwo.textContent).to.match(/20/);
        });
        it('should be able to sort reverse-numerically', function(){
            var sortByColumnTwoNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwoNumerically);
            utilities.click(sortByColumnTwoNumerically);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/20/);
            expect(rowThreeColumnTwo.textContent).to.match(/11/);
        });
        it('should be able to sort by custom function', function(){
            var sortByColumnThreeCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
            utilities.click(sortByColumnThreeCustom);

            var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
            var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

            expect(rowOneColumnThree.textContent).to.match(/Red/);
            expect(rowThreeColumnThree.textContent).to.match(/Green/);
        });
        it('should be able to sort by reverse custom function', function(){
            var sortByColumnThreeCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
            utilities.click(sortByColumnThreeCustom);
            utilities.click(sortByColumnThreeCustom);

            var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
            var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

            expect(rowOneColumnThree.textContent).to.match(/Green/);
            expect(rowThreeColumnThree.textContent).to.match(/Red/);
        });
        it('should be able to sort generically', function(){
            var sortByColumnFiveGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[4];
            utilities.click(sortByColumnFiveGeneric);

            var rowOneColumnFive = document.querySelector(TABLE_ROW).querySelectorAll('td')[4];
            var rowThreeColumnFive = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[4];

            expect(rowOneColumnFive.textContent).to.contain('["AAAAAAAAAAAAAAAAAAA"]');
            expect(rowThreeColumnFive.textContent).to.contain('["shoot em up"]');
        });
        it('should be able to sort reverse generically', function(){
            var sortByColumnFiveGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[4];
            utilities.click(sortByColumnFiveGeneric);
            utilities.click(sortByColumnFiveGeneric);

            var rowOneColumnFive = document.querySelector(TABLE_ROW).querySelectorAll('td')[4];
            var rowThreeColumnFive = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[4];

            expect(rowOneColumnFive.textContent).to.contain('["shoot em up"]');
            expect(rowThreeColumnFive.textContent).to.contain('["AAAAAAAAAAAAAAAAAAA"]');
        });
        it('should sort entire rows', function(){

            var firstRowColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            var firstRowColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var firstRowColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];

            expect(firstRowColumnOne.textContent).to.match(/Dinah Lance/);
            expect(firstRowColumnTwo.textContent).to.match(/12/);
            expect(firstRowColumnThree.textContent).to.match(/Black/);
        });
    });
    context('when using unique sort cases', function(){
        afterEach(function(){
            document.body.removeChild(this.element);
        });
        /*it('should not bother sorting one row', function(){
            scope.basicdata = [
                {'name' : "Kevin"}
            ];
            scope.basiccolumns = [
                {content : 'name', 
                header : 'Name'}
            ];
            var markup = '<akam-data-table data="basicdata" schema="basiccolumns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);

            var sortByColumnTwo =document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwo);
            console.log(document.querySelector('tbody'));
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            
            expect(rowOneColumnTwo.textContent).to.contain('Kevin');
        });*/
        it('should be able to turn off sorting', function(){
            scope.mydata = [
                {'name' : "Kevin"},
                {'name' : "Alejandro"}
            ];
            scope.columns = [
                {content : 'name', 
                header : 'Name',
                sort:false}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);

            var sortByColumnTwo =document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwo);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
        it('should be able to sort on different field', function(){
            scope.mydata = [{'name' : "Kevin",'id':5},{'name' : "Alejandro",'id':8}];
            scope.columns = [{content : 'name', header : 'Name',sort:'id'}];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
        it('should default sort by second column if first column is unsortable', function(){
            scope.mydata = [
                {'name' : "Kevin", 'id':25},
                {'name' : "Alejandro", 'id':17}
            ];
            scope.columns = [
                {content : 'name', header : 'Name',sort:false},
                {content:"id",header:"Id"}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Alejandro/);
        });
        it('should not default if all columns are unsortable', function(){
            scope.mydata = [
                {'name' : "Kevin", 'id':25},
                {'name' : "Alejandro", 'id':17}
            ];
            scope.columns = [
                {content : 'name', header : 'Name',sort:false},
                {content:"id",header:"Id",sort:false}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
        it('should default sort based upon custom function if provided', function(){
            scope.mydata = [
                {'name' : "Roy Harper", 'id':25,color:'Yellow'},
                {'name' : "Dinah Laurel Lance", 'id':17, color:'Green'},
                {'name' : "Oliver Queen", 'id':17, color:'Red'}
            ];
            scope.columns = [
                {content : 'name', header : 'Name',sort:false},
                {content:"id",header:"Id",sort:false},
                {content:"color",header:"Favorite Color",sort: function(){
                    var colorsValues = {
                        'Red' : 1,
                        'Yellow' : 2,
                        'Green' : 3
                    };
                    return colorsValues[this.color];
                }}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Oliver Queen/);
        });
        it('should be able to sort on different field', function(){
            scope.mydata = [{'name' : "Kevin",'id':5},{'name' : "Alejandro",'id':8}];
            scope.columns = [{content : 'name', header : 'Name',sort:'id'}];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true">></akam-data-table>';
            addElement(markup);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
    });/*
    context('when bulk deleting', function(){
        it('should have message box appear with confirmation of delete', function(){});
        it('should delete the chosen rows when confirmed', function(){});
        it('should not delete the chosen rows when canceled.', function(){});
        it('should not delete by close icon click', function(){});
    });
    context('when exporting', function(){
        it('should open mesage box', function(){});
        it('should be able to fill in save as field', function(){});
        it('should be able to change format field', function(){});
        it('should cancel exporting when cancel clicked', function(){});
        it('should cancel exporting when close icon clicked', function(){});
        it('should export selected items when export button clicked', function(){});
    });
    context('when editing a field', function(){
        it('should be able to edit a field', function(){});
        it('should activate inline validation of that field', function(){});
        it('should activate bubble help field if message over 40 characters', function(){});
        it('should highlight field where error is occuring', function(){});
        it('should accept edits when validation is complete', function(){});
    });*/
    context('when navigating the data table', function(){
        beforeEach(function(){
            var markup = '<akam-data-table data="mybigdata" schema="bigcolumns"></akam-data-table>';
            addElement(markup);
        });
        afterEach(function(){
            document.body.removeChild(this.element);
        });
        it('should highlight the clicked page', function() {
            var fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(4)');

            expect(fourthClickablePaginationIndex.classList.contains('active')).to.be.false;

            utilities.click(fourthClickablePaginationIndex.querySelector('a'));
            scope.$digest();

            fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(4)');
            expect(fourthClickablePaginationIndex.classList.contains('active')).to.be.true;
        });
        it('should change dislayed data appropriately', function(){
            var fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(4)');

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            expect(rowOneColumnTwo.textContent).to.match(/Aaron Miller/);

            utilities.click(fourthClickablePaginationIndex.querySelector('a'));
            scope.$digest();

            rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            expect(rowOneColumnTwo.textContent).to.match(/Amanda Lewis/);
        });
    });
    context('when interacting with the filter bar', function(){
        beforeEach(function(){
            var markup = '<akam-data-table data="mybigdata" schema="bigcolumns"></akam-data-table>';
            addElement(markup);
        });
        afterEach(function(){
            document.body.removeChild(this.element);
        });
        it('should filter based on input beginning-middle-end matches', function(){
            scope.$$childHead.state.filter = "Kevin";
            scope.$$childHead.updateSearchFilter();
            scope.$digest(); 
            expect(document.querySelectorAll(TABLE_ROW).length).to.equal(8);

        });
        //it('should change text color of matching input', function(){});
        it('should revert to pagination index 1', function(){
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest(); 
            var pageOneIndex = document.querySelector(PAGINATION_INDEX_NTH+'(2)');
            var previousArrow = document.querySelector(PREVIOUS_BUTTON);
            var nextArrow = document.querySelector(NEXT_BUTTON);

            expect(pageOneIndex.classList.contains('active')).to.be.true;
            expect(previousArrow.classList.contains('disabled')).to.be.true;
            expect(nextArrow.classList.contains('disabled')).to.be.true;
        });
    });/*
    context('when grouping items', function(){
        it('should display icon representing grouping of items',function(){});
        it('should use grouping/hierarchal tree to render',function(){});
        it('should expand grouping when arrow is clicked', function(){});
        it('should not use more than 3 levels of grouping', function(){});
        it('should perform action on each subitem when top level action happens', function(){});
    });
    context('when using action button', function(){
        it('should display all actions that can be taken', function(){});        
        it('should be able to be closed and no action taken', function(){});
        it('should perform an action on that row if pressed', function(){});
        it('should be able to take user to a different location', function(){});
    });
    context('when mouseover events occur', function(){
        it('should change color of the row mouse is over', function(){});        
        it('should change color of the action the mouse is over', function(){});
    });*/
    context('when data gets messed up', function(){
        afterEach(function(){
            document.body.removeChild(this.element);
        });
        it('should recognize null content when redenring', function(){
            scope.baddata = [
                {first : "Nick"},
                {first: "Kevin"}];
            scope.columns = [
                {content : function(){
                    return null;
                }, 
                header : 'Full Name'}
            ];
            var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);

            utilities.click(document.querySelectorAll(TABLE_COLUMN_HEADER)[1]);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var allVisibleRows = document.querySelectorAll(TABLE_ROW);

            expect(rowOneColumnTwo.textContent).to.match(/ /);
            expect(allVisibleRows.length).to.equal(2);
        });
        it('should recognize null content when sorting name', function(){
            scope.baddata = [
                {name : null},
                {name : null},
                {name : "Kevin"},
                {name : null},
                {name: "James"}];
            scope.columns = [
                {content : "name", 
                header : 'Name'}
            ];
            var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
            
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowTwoColumnTwo = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[1];
            var rowFourColumnTwo = document.querySelectorAll(TABLE_ROW)[3].querySelectorAll('td')[1];
            var rowFiveColumnTwo = document.querySelectorAll(TABLE_ROW)[4].querySelectorAll('td')[1];

            //console.log(document.querySelector('tbody'));
            expect(rowOneColumnTwo.textContent).to.contain('');
            expect(rowTwoColumnTwo.textContent).to.contain('');
            expect(rowFourColumnTwo.textContent).to.contain('James');
            expect(rowFiveColumnTwo.textContent).to.contain('Kevin');
        });
    });
    context('when errors are thrown', function(){
        it('should throw error when schema is not an array', function(){
            scope.messedupcolumns = {};
            var markup = '<akam-data-table data="mydata" schema="messedupcolumns"></akam-data-table>';
            try{
                addElement(markup);
            } catch (e){
                expect(e).to.equal("Schema must be an array");
            }
        });
        it('should throw error when data is not an array', function(){
            scope.messedupdata = {};
            var markup = '<akam-data-table data="messedupdata" schema="columns"></akam-data-table>';
            try{
                addElement(markup);
            } catch (e){
                expect(e).to.equal("Data must be an array");
            }
        });
        it('should throw error when column content is not a string or function', function(){
            scope.badcontent = [
            {content: {}}
            ]
            var markup = '<akam-data-table data="mydata" schema="badcontent"></akam-data-table>';
            try{
                addElement(markup);
            } catch (e){
                expect(e).to.equal("The column content field is using an unknown type.  Content field may only be String or Function type");
            }
        });
         it('should throw error when sort column is null', function(){
            scope.mydata = [
                {'name' : "Kevin"},
                {'name' : "Alejandro"}
            ];
            scope.columns = [
                {content : 'name', 
                header : 'Name',
                sort:null}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns"></akam-data-table>';
            addElement(markup);
            try{
                scope.$$childHead.sortColumn(undefined);
            } catch (e){
                expect(e).to.equal("Column may not be null/undefined");
            }
            document.body.removeChild(this.element);
        });
    });
});