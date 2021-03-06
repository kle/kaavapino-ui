import React, { Component } from 'react'
import { Input, Button, Dropdown } from 'semantic-ui-react'
import projectUtils from '../../utils/projectUtils'

class Comment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      showEdit: false,
      menuOpen: false,
      content: props.content
    }
  }

  handleMouseEnter = () => {
    const { editable } = this.props
    if (!editable) {
      return
    }
    this.setState({ showEdit: true })
  }

  handleMouseLeave = () => {
    const { editable } = this.props
    if (!editable) {
      return
    }
    this.setState({ showEdit: false })
  }

  handleEditCancel = () => {
    this.setState({ editing: false, content: this.props.content })
  }

  handleEditSave = () => {
    if (this.state.content.trim()) {
      this.props.onSave(this.state.content)
      this.setState({ editing: false })
    }
  }

  handleDelete = () => {
    this.props.onDelete()
  }

  render() {
    const { showEdit, menuOpen, editing, content } = this.state
    const { created_at, user: userId, _metadata, generated } = this.props
    const user = !generated ?
      projectUtils.formatUsersName(_metadata.users.find(({ id }) => id === userId)) :
      'Automaattinen'
    const date = projectUtils.formatDate(created_at)
    const time = projectUtils.formatTime(created_at)
    return (
      <div className='comment-container' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className='comment-header-container'>
          <span className={`comment-creator${generated ? ' generated' : ''}`}>{ user }</span>
          <div className='comment-edit-container'>
            { (showEdit || menuOpen) && (
              <Dropdown pointing='left' icon='setting' onOpen={() => this.setState({ menuOpen: true })} onClose={() => this.setState({ menuOpen: false })} direction='left'>
                <Dropdown.Menu>
                  <Dropdown.Item icon='pencil' text='Muokkaa' onClick={() => this.setState({ editing: true })} />
                  <Dropdown.Item icon='trash' text='Poista' onClick={this.handleDelete} />
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
        <div className='comment-content'>
          { !editing && content }
          { editing && (
            <Input
              onChange={(e) => this.setState({ content: e.target.value })}
              focus
              type='text'
              fluid
              value={content}
            />
          )}
        </div>
        <div className='comment-footer'>
          <div className='comment-footer-actions'>
            { editing && (
              <React.Fragment>
                <Button onClick={this.handleEditCancel}>Peruuta</Button>
                <Button onClick={this.handleEditSave} disabled={!content} color='green'>Tallenna</Button>
              </React.Fragment>
            )}
          </div>
          <div className='comment-footer-time-container'>
            <span>{ date }</span>
            <span>{ time }</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Comment