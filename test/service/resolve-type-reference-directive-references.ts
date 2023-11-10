import t from 'tap'
import { getLanguageService } from '../../src/service/language-service.js'

getLanguageService().getProgram()
t.pass('just a test file for coverage purposes, nothing to do')
