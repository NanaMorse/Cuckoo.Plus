import 'mocha'
import { expect } from 'chai'
import Formatter from './formatter'

const formatter = new Formatter()

describe('formatter.format', () => {
    it('ignores strings with no dashes', () => {
        expect(formatter.format("aaaaaa")).to.equal("aaaaaa")
    })
    it('ignores strings with a single dash', () => {
        expect(formatter.format("-aaaaaa")).to.equal("-aaaaaa")
        expect(formatter.format("aaaaaa-")).to.equal("aaaaaa-")
        expect(formatter.format("aaa-aaa")).to.equal("aaa-aaa")
        expect(formatter.format("aaa -aaa")).to.equal("aaa -aaa")
        expect(formatter.format("aaa- aaa")).to.equal("aaa- aaa")
        expect(formatter.format("aaa - aaa")).to.equal("aaa - aaa")
    })
    it('format strings with a pair of correct dashes', () => {
        expect(formatter.format("-aaaaaa-")).to.equal("<del>aaaaaa</del>")
        expect(formatter.format("-aaa- aaa")).to.equal("<del>aaa</del> aaa")
        expect(formatter.format("aaa -aaa-")).to.equal("aaa <del>aaa</del>")
        expect(formatter.format("aa -aa- aa")).to.equal("aa <del>aa</del> aa")
    })
    it('ignore strings with a pair of wrong dashes', () => {
        expect(formatter.format("-aaa-aaa")).to.equal("-aaa-aaa")
        expect(formatter.format("aaa-aaa-")).to.equal("aaa-aaa-")
        expect(formatter.format("aa-aa-aa")).to.equal("aa-aa-aa")
    })
    it('format string with a pair of correct dashes and a wrong dash', () => {
        expect(formatter.format("-aaa-aaa-")).to.equal("<del>aaa-aaa</del>")
        expect(formatter.format("-a-aa- aaa")).to.equal("<del>a-aa</del> aaa")
        expect(formatter.format("-aaa- a-aa")).to.equal("<del>aaa</del> a-aa")
        expect(formatter.format("aaa -a-aa-")).to.equal("aaa <del>a-aa</del>")
        expect(formatter.format("a-aa -aaa-")).to.equal("a-aa <del>aaa</del>")
        expect(formatter.format("aa -a-a- aa")).to.equal("aa <del>a-a</del> aa")
        expect(formatter.format("a-a -aa- aa")).to.equal("a-a <del>aa</del> aa")
    })
    it('format string with a pair of correct dashes and a correct dash', () => {
        expect(formatter.format("-a -aa- aaa")).to.equal("<del>a -aa</del> aaa")
        expect(formatter.format("-aaa- a -aa")).to.equal("<del>aaa</del> a -aa")
        expect(formatter.format("aaa -a -aa-")).to.equal("aaa <del>a -aa</del>")
        expect(formatter.format("a- aa -aaa-")).to.equal("a- aa <del>aaa</del>")
        expect(formatter.format("aa -a- a- aa")).to.equal("aa <del>a- a</del> aa")
        expect(formatter.format("aa -a -a- aa")).to.equal("aa <del>a -a</del> aa")
        expect(formatter.format("a- a -aa- aa")).to.equal("a- a <del>aa</del> aa")
    })
    it('format string with two pairs of correct dashes', () => {
        expect(formatter.format("a -a- aa -a- a")).to.equal("a <del>a</del> aa <del>a</del> a")
        expect(formatter.format("-aa- aa -a- a")).to.equal("<del>aa</del> aa <del>a</del> a")
        expect(formatter.format("a -a- aa -aa-")).to.equal("a <del>a</del> aa <del>aa</del>")
        expect(formatter.format("-aa- aa -aa-")).to.equal("<del>aa</del> aa <del>aa</del>")
    })
    it('format string with two enclosing pairs of correct dashes', () => {
        expect(formatter.format("a -a -aa- a- a")).to.equal("a <del>a -aa- a</del> a")
    })
})
