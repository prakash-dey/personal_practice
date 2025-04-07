import {validateRegistration, checkValidation} from '../utils/validator.js';

router.post('/register', validateRegistration,checkValidation,register);
