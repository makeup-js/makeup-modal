var modal = require('../index.js');
var testData = require('./data.js');
var modalEl;
var modalNotified;
var unmodalNotified;

function doBeforeAll(html) {
    document.querySelector('body').innerHTML = html;
    modalEl = document.querySelector('.modal');
    modalNotified = [];
    unmodalNotified = [];

    modalEl.addEventListener('modal', function() {
        modalNotified.push(true);
    });

    modalEl.addEventListener('unmodal', function() {
        unmodalNotified.push(true);
    });
}

testData.forEach(function(data) {
    describe('makeup-modal', function() {
        doBeforeAll(data.html);
        describe('when modal is activated', function() {
            beforeAll(function() {
                modal.modal(modalEl);
            });
            it('should observe one modal event', function() {
                expect(modalNotified.length).toEqual(1);
            });
            it('should observe zero unmodal events', function() {
                expect(unmodalNotified.length).toEqual(0);
            });
        });
        describe('when modal is deactivated', function() {
            beforeAll(function() {
                modal.unmodal();
            });
            it('should observe one unmodal event', function() {
                expect(unmodalNotified.length).toEqual(1);
            });
            it('should observe zero modal events', function() {
                expect(modalNotified.length).toEqual(1);
            });
        });
    });
});
