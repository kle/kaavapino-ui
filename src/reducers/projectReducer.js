import {
  FETCH_PROJECTS_SUCCESSFUL,
  FETCH_OWN_PROJECTS_SUCCESSFUL,
  FETCH_PROJECTS,
  FETCH_PROJECT_SUCCESSFUL,
  SET_PROJECTS,
  SET_OWN_PROJECTS,
  SET_AMOUNT_OF_PROJECTS_TO_SHOW,
  INCREASE_AMOUNT_OF_PROJECTS_TO_SHOW,
  SET_AMOUNT_OF_PROJECTS_TO_INCREASE,
  SET_TOTAL_PROJECTS,
  SET_TOTAL_OWN_PROJECTS,
  UPDATE_PROJECT,
  CREATE_PROJECT_SUCCESSFUL,
  CREATE_OWN_PROJECT_SUCCESSFUL,
  INITIALIZE_PROJECT,
  INITIALIZE_PROJECT_SUCCESSFUL,
  SAVE_PROJECT,
  SAVE_PROJECT_SUCCESSFUL,
  VALIDATE_PROJECT_FIELDS,
  VALIDATE_PROJECT_FIELDS_SUCCESSFUL,
  CHANGE_PROJECT_PHASE,
  CHANGE_PROJECT_PHASE_SUCCESSFUL,
  CHANGE_PROJECT_PHASE_FAILURE,
  PROJECT_FILE_UPLOAD_SUCCESSFUL,
  PROJECT_FILE_REMOVE_SUCCESSFUL,
  PROJECT_SET_CHECKING,
  PROJECT_SET_DEADLINES_SUCCESSFUL
} from '../actions/projectActions'

export const initialState = {
  projects: [],
  totalProjects: null,
  amountOfProjectsToIncrease: 10,
  amountOfProjectsToShow: 10,
  totalOwnProjects: null,
  ownProjects: [],
  loadingProjects: false,
  users: [],
  currentProject: null,
  currentProjectLoaded: false,
  saving: false,
  changingPhase: false,
  validating: false,
  hasErrors: false,
  checking: false,
  pollingProjects: false
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECTS: {
      return {
        ...state,
        currentProject: null,
        currentProjectLoaded: false,
        loadingProjects: true,
        projects: [],
        ownProjects: [],
        amountOfProjectsToIncrease: 10,
        amountOfProjectsToShow: 10
      }
    }

    case FETCH_OWN_PROJECTS_SUCCESSFUL: {
      return {
        ...state,
        ownProjects: state.ownProjects.concat(action.payload)
      }
    }

    case FETCH_PROJECTS_SUCCESSFUL: {
      return {
        ...state,
        projects: state.projects.concat(action.payload),
        loadingProjects: false
      }
    }

    case SET_PROJECTS: {
      return {
        ...state,
        projects: action.payload
      }
    }

    case SET_OWN_PROJECTS: {
      return {
        ...state,
        ownProjects: action.payload
      }
    }

    case SET_AMOUNT_OF_PROJECTS_TO_INCREASE: {
      return {
        ...state,
        amountOfProjectsToIncrease: action.payload
      }
    }

    case INCREASE_AMOUNT_OF_PROJECTS_TO_SHOW: {
      return {
        ...state,
        pollingProjects: true
      }
    }

    case SET_AMOUNT_OF_PROJECTS_TO_SHOW: {
      return {
        ...state,
        amountOfProjectsToShow: action.payload,
        pollingProjects: false
      }
    }

    case SET_TOTAL_PROJECTS: {
      return {
        ...state,
        totalProjects: action.payload
      }
    }

    case SET_TOTAL_OWN_PROJECTS: {
      return {
        ...state,
        totalOwnProjects: action.payload
      }
    }

    case CREATE_PROJECT_SUCCESSFUL: {
      return {
        ...state,
        projects: state.projects.concat(action.payload)
      }
    }

    case CREATE_OWN_PROJECT_SUCCESSFUL: {
      return {
        ...state,
        ownProjects: state.ownProjects.concat(action.payload)
      }
    }

    case INITIALIZE_PROJECT: {
      return {
        ...state,
        projects: [],
        ownProjects: [],
        amountOfProjectsToIncrease: 10,
        amountOfProjectsToShow: 10,
        currentProject: null,
        currentProjectLoaded: false
      }
    }

    case INITIALIZE_PROJECT_SUCCESSFUL: {
      return {
        ...state,
        currentProjectLoaded: true,
        checking: false
      }
    }

    case UPDATE_PROJECT:
    case FETCH_PROJECT_SUCCESSFUL: {
      return {
        ...state,
        currentProject: action.payload,
        saving: false
      }
    }

    case SAVE_PROJECT: {
      return {
        ...state,
        saving: true
      }
    }

    case SAVE_PROJECT_SUCCESSFUL: {
      return {
        ...state,
        saving: false
      }
    }

    case VALIDATE_PROJECT_FIELDS: {
      return {
        ...state,
        validating: true
      }
    }

    case VALIDATE_PROJECT_FIELDS_SUCCESSFUL: {
      return {
        ...state,
        validating: false,
        hasErrors: action.payload
      }
    }

    case CHANGE_PROJECT_PHASE: {
      return {
        ...state,
        changingPhase: true
      }
    }

    case CHANGE_PROJECT_PHASE_SUCCESSFUL: {
      return {
        ...state,
        currentProject: action.payload,
        changingPhase: false
      }
    }

    case CHANGE_PROJECT_PHASE_FAILURE: {
      return {
        ...state,
        changingPhase: false
      }
    }

    case PROJECT_FILE_UPLOAD_SUCCESSFUL: {
      const updatedAttributeData = { ...state.currentProject.attribute_data }
      const { file, description } = action.payload
      updatedAttributeData[action.payload.attribute] = { link: file, description }
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          attribute_data: { ...updatedAttributeData }
        }
      }
    }

    case PROJECT_FILE_REMOVE_SUCCESSFUL: {
      const updatedAttributeData = { ...state.currentProject.attribute_data }
      delete updatedAttributeData[action.payload]
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          attribute_data: { ...updatedAttributeData }
        }
      }
    }

    case PROJECT_SET_CHECKING: {
      return {
        ...state,
        checking: action.payload
      }
    }

    case PROJECT_SET_DEADLINES_SUCCESSFUL: {
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          deadlines: [ ...action.payload ]
        }
      }
    }

    default: {
      return state
    }
  }
}
