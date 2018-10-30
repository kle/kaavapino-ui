import { reducer as auth } from 'redux-oidc'
import { reducer as form } from 'redux-form'
import { reducer as project } from './projectReducer'
import { reducer as user } from './userReducer'
import { reducer as phase } from './phaseReducer'

export default {
  auth,
  form,
  project,
  user,
  phase
}