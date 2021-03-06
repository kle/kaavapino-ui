import React, { Component } from 'react'
import { Divider } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '../common/Button'

class QuickNav extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sectionHeights: [],
      active: 0
    }
  }

  getPosition = (element) => {
    let yPosition = 0

    while (element) {
      yPosition += (element.offsetTop - element.scrollTop + element.clientTop)
      element = element.offsetParent
    }

    return yPosition
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.setState({ sectionHeights: this.initSections(this.props.sections) })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.phaseTitle !== prevProps.phaseTitle) {
      this.setState({ sectionHeights: this.initSections(this.props.sections) })
    }
  }

  initSections = (sections) => {
    const sectionHeights = []
    if (!sections) {
      return
    }
    sections.forEach((section) => {
      const c = document.getElementById(`title-${section.title}`)
      sectionHeights.push({ title: section.title, y: this.getPosition(c) })
    })
    return sectionHeights.sort((a, b) => a.y - b.y)
  }

  handleScroll = () => {
    let activeTitle = 0
    if (!this.state.sectionHeights) {
      return
    }
    this.state.sectionHeights.forEach((section, i) => {
      if (section.y - 20 < window.scrollY) {
        activeTitle = i
      }
    })
    if (activeTitle === this.state.activeTitle) {
      return
    }
    this.setState({ active: activeTitle })
  }

  handleClick = (title) => {
    const c = document.getElementById(`title-${title}`)
    c.scrollIntoView()
  }

  render() {
    return (
      <div className='quicknav-container'>
        <span className='quicknav-title'>{ this.props.projectName}</span>
        <Divider style={{ whiteSpace: 'pre-wrap' }} horizontal>{ this.props.phaseTitle }</Divider>
        <div className='quicknav-content'>
          { this.state.sectionHeights && this.state.sectionHeights.map((section, i) => {
            return (
              <span
                key={i}
                className={`quicknav-item ${i === this.state.active ? 'active' : ''}`}
                onClick={() => this.handleClick(section.title)}
              >
                { section.title }
              </span>
            )
          }) }
        </div>
        <div className='quicknav-buttons'>
          <Button
            handleClick={this.props.handleSave}
            value='Tallenna'
            icon={<FontAwesomeIcon icon='check' />}
            loading={this.props.saving}
            help='Tallentaa hankkeen'
          />
          <Button
            handleClick={this.props.handleCheck}
            value='Tarkista'
            icon={<FontAwesomeIcon icon='search' />}
            help='Korostaa pakolliset puuttuvat kentät'
          />
        </div>
      </div>
    )
  }
}

export default QuickNav