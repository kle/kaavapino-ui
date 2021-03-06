import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Loader } from 'semantic-ui-react'
import { initializeProject } from '../../actions/projectActions'
import {
  currentProjectSelector,
  currentProjectLoadedSelector,
  changingPhaseSelector
} from '../../selectors/projectSelector'
import { phasesSelector } from '../../selectors/phaseSelector'
import { latestEditFieldSelector, allEditFieldsSelector } from '../../selectors/schemaSelector'
import { NavHeader, NavActions, NavAction } from '../common/NavHeader'
import Timeline from './Timeline'
import ProjectEditPage from '../projectEdit'
import ProjectCardPage from '../projectCard'
import ProjectDocumentsPage from '../projectDocuments'
import DeadlineModal from './DeadlineModal'
import projectUtils from '../../utils/projectUtils'

class ProjectPage extends Component {
  constructor(props) {
    super(props)

    let selectedPhase
    if (props.currentProject) {
      selectedPhase = props.currentProject.phase
    } else {
      selectedPhase = 0
    }

    this.state = {
      selectedPhase: selectedPhase,
      showDeadlineModal: false
    }
  }

  componentDidMount() {
    const { currentProjectLoaded } = this.props
    if (!currentProjectLoaded) {
      this.props.initializeProject(this.props.id)
    }
  }

  componentDidUpdate(prevProps) {
    const { currentProject, changingPhase, edit } = this.props
    if ((!prevProps.currentProject && currentProject) || (prevProps.changingPhase && !changingPhase)) {
      this.setState({ selectedPhase: currentProject.phase })
      document.title = currentProject.name
    }

    if (prevProps.edit && !edit) this.setState({ selectedPhase: currentProject.phase })
  }

  switchPhase = (phase) => {
    if (this.props.edit) this.setState({ selectedPhase: phase })
  }

  getRouteItems = () => {
    const { currentProject, edit, documents } = this.props
    const path = [
      { value: 'Kaavahankkeet', path: '/' },
      { value: `${currentProject.name}`, path: `/${currentProject.id}` }
    ]
    if (edit) {
      path.push({ value: 'Muokkaa', path: `/${currentProject.id}/edit` })
    } else if (documents) {
      path.push({ value: 'Dokumentit', path: `/${currentProject.id}/documents` })
    }
    return path
  }

  getTitle = (name) => {
    const { edit, documents } = this.props
    if (edit) {
      return `${name}, muokkaa`
    } else if (documents) {
      return `${name}, dokumentit`
    }
    return `${name}, hankekortti`
  }

  getProjectPageContent = () => {
    const { edit, documents, currentProject, phases } = this.props
    const { selectedPhase } = this.state
    if (edit) {
      return <ProjectEditPage selectedPhase={selectedPhase} project={currentProject} />
    } else if (documents) {
      return <ProjectDocumentsPage />
    }
    return (
      <ProjectCardPage
        attributeData={currentProject.attribute_data}
        type={currentProject.type}
        deadlines={currentProject.deadlines}
        name={currentProject.name}
        subtype={currentProject.subtype}
        phases={phases}
      />
    )
  }

  getNavActions = () => {
    const { edit, documents, currentProject: { id } } = this.props
    return !(edit || documents) ?
      (
        <NavActions>
          <NavAction to={`/${id}/edit`}><FontAwesomeIcon icon='pen'/>Muokkaa</NavAction>
          <NavAction to={`/${id}/documents`}><FontAwesomeIcon icon='file'/>Luo dokumentteja</NavAction>
          <NavAction onClick={() => window.print()}><FontAwesomeIcon icon='print'/>Tulosta hankekortti</NavAction>
          <NavAction onClick={() => this.setState({ showDeadlineModal: true })}><FontAwesomeIcon icon='cog'/>Määräajat</NavAction>
        </NavActions>
      ) :
      (
        <NavActions>
          <NavAction to={`/${id}`}><FontAwesomeIcon icon='arrow-left'/>Hankekortti</NavAction>
        </NavActions>
      )
  }

  getLatestChange = () => {
    const { edit, latestEditField } = this.props
    if (!edit || !latestEditField || !latestEditField.name) {
      return null
    }
    return `(Viimeisin muokkaus: ${latestEditField.name} ${projectUtils.formatDateTime(latestEditField.timestamp)} ${latestEditField.user_name})`
  }

  getAllChanges = () => {
    const { allEditFields, edit } = this.props
    if (!edit) return []
    return allEditFields.map((f, i) => {
      const value = `${projectUtils.formatDateTime(f.timestamp)} ${f.name} ${f.user_name}`
      return { text: value, value: `${value}-${i}`, key: `${value}-${i}`, disabled: true }
    })
  }

  renderLoading = () => (
    <div className='project-container'>
      <NavHeader
        routeItems={[{ value: 'Kaavahankkeet', path: '/' }, { value: 'Ladataan...', path: '/' }]}
        title={'Ladataan...'}
      />
      <div className='project-page-content'>
        <Loader inline={'centered'} active>Ladataan</Loader>
      </div>
    </div>
  )

  render() {
    const { edit, currentProject, phases, currentProjectLoaded } = this.props
    const loading = (!currentProjectLoaded || !phases)
    if (loading) {
      return this.renderLoading()
    }
    const { type, subtype, phase } = currentProject
    const currentPhases = phases.filter(({ project_type, project_subtype }) => {
      return project_type === type && project_subtype === subtype
    })
    const projectPhase = currentPhases.find((p) => p.id === phase)
    const selectedPhase = currentPhases.find((phase) => phase.id === this.state.selectedPhase)
    return (
      <div className='project-container'>
        <NavHeader
          routeItems={this.getRouteItems()}
          title={this.getTitle(currentProject.name)}
          actions={this.getNavActions()}
          info={this.getLatestChange()}
          infoOptions={this.getAllChanges()}
        />
        <Timeline
          phase={selectedPhase}
          projectPhase={projectPhase}
          items={currentPhases}
          type={currentProject.type}
          disabled={!edit}
          switchPhase={this.switchPhase}
        />
        <DeadlineModal
          open={this.state.showDeadlineModal}
          handleClose={() => this.setState({ showDeadlineModal: false })}
        />
        <div className='project-page-content'>
          { this.getProjectPageContent() }
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  initializeProject
}

const mapStateToProps = (state) => {
  return {
    currentProject: currentProjectSelector(state),
    phases: phasesSelector(state),
    currentProjectLoaded: currentProjectLoadedSelector(state),
    changingPhase: changingPhaseSelector(state),
    latestEditField: latestEditFieldSelector(state),
    allEditFields: allEditFieldsSelector(state)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectPage)