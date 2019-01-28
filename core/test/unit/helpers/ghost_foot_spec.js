var should = require('should'),
    sinon = require('sinon'),
    helpers = require('../../../server/helpers'),
    proxy = require('../../../server/helpers/proxy'),
    settingsCache = proxy.settingsCache;

describe('{{ghost_foot}} helper', function () {
    var settingsCacheStub;

    afterEach(function () {
        sinon.restore();
    });

    beforeEach(function () {
        settingsCacheStub = sinon.stub(settingsCache, 'get');
    });

    it('outputs global injected code', function (done) {
        settingsCacheStub.withArgs('ghost_foot').returns('<script>var test = \'I am a variable!\'</script>');

        helpers.ghost_foot({data: {}}).then(function (rendered) {
            should.exist(rendered);
            rendered.string.should.match(/<script>var test = 'I am a variable!'<\/script>/);

            done();
        }).catch(done);
    });

    it('outputs post injected code', function (done) {
        settingsCacheStub.withArgs('ghost_foot').returns('<script>var test = \'I am a variable!\'</script>');

        helpers.ghost_foot({
            data: {
                root: {
                    post: {
                        codeinjection_foot: 'post-codeinjection'
                    }
                }
            }
        }).then(function (rendered) {
            should.exist(rendered);
            rendered.string.should.match(/<script>var test = 'I am a variable!'<\/script>/);
            rendered.string.should.match(/post-codeinjection/);

            done();
        }).catch(done);
    });

    it('handles post injected code being null', function (done) {
        settingsCacheStub.withArgs('ghost_foot').returns('<script>var test = \'I am a variable!\'</script>');

        helpers.ghost_foot({
            data: {
                root: {
                    post: {
                        codeinjection_foot: null
                    }
                }
            }
        }).then(function (rendered) {
            should.exist(rendered);
            rendered.string.should.match(/<script>var test = 'I am a variable!'<\/script>/);
            rendered.string.should.not.match(/post-codeinjection/);

            done();
        }).catch(done);
    });

    it('handles post injected code being empty', function (done) {
        settingsCacheStub.withArgs('ghost_foot').returns('<script>var test = \'I am a variable!\'</script>');

        helpers.ghost_foot({
            data: {
                root: {
                    post: {
                        codeinjection_foot: ''
                    }
                }
            }
        }).then(function (rendered) {
            should.exist(rendered);
            rendered.string.should.match(/<script>var test = 'I am a variable!'<\/script>/);
            rendered.string.should.not.match(/post-codeinjection/);

            done();
        }).catch(done);
    });

    it('handles global empty code injection', function (done) {
        settingsCacheStub.withArgs('ghost_foot').returns('');

        helpers.ghost_foot({data: {}}).then(function (rendered) {
            should.exist(rendered);
            rendered.string.should.eql('');

            done();
        }).catch(done);
    });

    it('handles global undefined code injection', function (done) {
        settingsCacheStub.withArgs('ghost_foot').returns(undefined);

        helpers.ghost_foot({data: {}}).then(function (rendered) {
            should.exist(rendered);
            rendered.string.should.eql('');

            done();
        }).catch(done);
    });
});