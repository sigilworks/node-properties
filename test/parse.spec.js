const { expect } = require('chai');
const properties = require('../lib');
const path = require('path');


describe('parsing', function() {

    context('parse', function() {
        it('default', function() {
            const options = { path: true };
            properties.parse('properties', options, (error, props) => {
                expect(props).to.deep.equal({
                    a1: 'b',
                    a2: 'b',
                    a3: 'b',
                    a4: 'b',
                    a5: 'b',
                    '': 'b',
                    a6: null,
                    a7: null,
                    a8: null,
                    a9: 'b',
                    a10: 'b',
                    a11: 'b',
                    a12: 'b',
                    'a121   ': 'b',
                    a13: null,
                    a14: 'b',
                    a15: 'b',
                    'a16=': '=b',
                    '\\': '"\\\\  ',
                    'a\\n\\\\17': '\\n\\\\b',
                    a18: 'b\n\t',
                    ' ': ' ',
                    '\n': '\n',
                    '聵': '聵',
                    '↑': '↓',
                    a19: 'É',
                    '←': '→',
                    '→': '→',
                    a20: true,
                    a21: false,
                    a22: 123,
                    a23: null,
                    a24: undefined,
                    '[a]': null
                });
            });
        });

        it('no key, no value', function() {
            properties.parse(':', (error, props) => {
                expect(props).to.deep.equal({ '': null });
            });
        });

        it('no json', function() {
            const text = 'a1 true\na2 false\na3 123\na4 [1, 2, \\\n		3]\na5 : { \"1\"\\\n		: { \"2\": 3 }}';
            properties.parse(text, (error, props) => {
                expect(props).to.deep.equal({
                    a1: true,
                    a2: false,
                    a3: 123,
                    a4: '[1, 2, 3]',
                    a5: '{ "1": { "2": 3 }}'
                });
            });
        });
    });

    it('reviver', function() {
        const options = {
            reviver(key, value) {
                if (key === 'a') return 'b';
                if (key === 'b') return;
                return this.assert();
            }
        };

        properties.parse ('a 1\nb 1\nc 1', options, (error, props) => {
            expect(props).to.deep.equal({ a: 'b', c: 1 });
        });
    });

    it('empty data', function() {
        properties.parse ('', (error, props) => {
            expect(props).to.deep.equal({});
        });
    });

    context('separators and tokens', function() {
        it('custom separator and comment tokens', function() {
            const options = { comments: ';', separators: '-' };

            properties.parse (';a\n!a\na1:b\na2-b', options, (error, props) => {
                expect(props).to.deep.equal({ a1: 'b', a2: 'b' });
            });
        });

        it('custom separator and comment tokens, strict', function() {
            const options = { comments: ';', separators: '-', strict: true };

            properties.parse (';a\n!a\na1:b\na2-b', options, (error, props) => {
                expect(props).to.deep.equal({ '!a': null, 'a1:b': null, a2: 'b' });
            });
        });
    });

    context('sections', function() {
        it('sections', function() {
            const options = { sections: true, path: true };

            properties.parse ('sections', options, (error, props) => {
                expect(props).to.deep.equal({
                    a: 1,
                    s1: { a: 1 },
                    s2: { a: 1 },
                    s3: {},
                    'a=1': { 'b[': 'a]c' },
                    '': { a: 1 },
                    'a\\t\ta→聵': { a: 1 }
                });
            });
        });
    });

    context('variables', function() {});

    context('namespaces', function() {});

    context('include', function() {});
});
