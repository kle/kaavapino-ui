import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchComments,
  pollComments,
  createComment,
  editComment,
  deleteComment,
  increaseAmountOfCommentsToShow
} from '../../actions/commentActions'
import {
  commentsSelector,
  commentsLoadingSelector,
  pollingCommentsSelector,
  amountOfCommentsToShowSelector
} from '../../selectors/commentSelector'
import { userIdSelector } from '../../selectors/authSelector'
import { Form, Input, Button } from 'semantic-ui-react'
import Comment from './Comment'

class CommentList extends Component {
  constructor(props) {
    super(props)
    this.commentsRef = React.createRef()
    this.prevHeight = 0
    this.state = {
      value: ''
    }
  }

  componentDidMount () {
    this.props.fetchComments(this.props.project)
    this.poll = setInterval(() => this.props.pollComments(this.props.project), 60000)
  }

  componentDidUpdate (prevProps) {
    if ((prevProps.comments.length < this.props.comments.length) && !prevProps.pollingComments) {
      const comments = this.commentsRef.current
      if (comments) {
        comments.scrollTop = comments.scrollHeight
      }
    } else if (prevProps.amountOfCommentsToShow !== this.props.amountOfCommentsToShow) {
      const comments = this.commentsRef.current
      if (prevProps.amountOfCommentsToShow < this.props.amountOfCommentsToShow) {
        comments.scrollTop = comments.scrollHeight - this.prevHeight
      } else {
        comments.scrollTop = comments.scrollHeight
      }
    }
  }

  componentWillUnmount () {
    clearInterval(this.poll)
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value })
  }

  handleSubmit = () => {
    if (this.state.value.trim()) {
      this.props.createComment(this.props.project, this.state.value)
      this.setState({ value: '' })
    }
  }

  handleScroll = () => {
    if (this.commentsRef.current.scrollTop < 1) {
      const { pollingComments, increaseAmountOfCommentsToShow } = this.props
      if (!pollingComments) {
        increaseAmountOfCommentsToShow()
        const comments = this.commentsRef.current
        this.prevHeight = comments.scrollHeight
      }
    }
  }

  render () {
    const { comments, commentsLoading, userId, amountOfCommentsToShow, pollingComments } = this.props
    const begin = comments.length < amountOfCommentsToShow ? comments.length : amountOfCommentsToShow
    return (
      <div className='comment-list-container'>
        <div className='comments' ref={this.commentsRef} onScroll={this.handleScroll}>
          { (commentsLoading || pollingComments) && <p className='comments-message'>Ladataan...</p> }
          { !commentsLoading && comments.length === 0 && <p className='comments-message'>Ei kommentteja.</p> }
          { comments.slice(comments.length - begin, comments.length).map((comment, i) => (
            <Comment
              key={`${i}-${comment.id}`}
              { ...comment }
              editable={userId === comment.user}
              onSave={(content) => this.props.editComment(this.props.project, comment.id, content)}
              onDelete={() => this.props.deleteComment(this.props.project, comment.id)}
            />
          )) }
        </div>
        <div className='comment-submit-container'>
          <Form>
            <Input
              onChange={this.handleChange}
              type='text'
              fluid
              placeholder='Lisää kommentti'
              action={ <Button primary onClick={this.handleSubmit}>Lähetä</Button> }
              value={this.state.value}
            />
          </Form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  comments: commentsSelector(state),
  commentsLoading: commentsLoadingSelector(state),
  userId: userIdSelector(state),
  pollingComments: pollingCommentsSelector(state),
  amountOfCommentsToShow: amountOfCommentsToShowSelector(state)
})

const mapDispatchToProps = {
  fetchComments,
  pollComments,
  createComment,
  editComment,
  deleteComment,
  increaseAmountOfCommentsToShow
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentList)