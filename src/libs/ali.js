import config from './config.js'
import router from '@/router'
import {alert} from 'element-ui'
const appServer = config.url + config.work
let OSS = require('ali-oss');
