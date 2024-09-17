// ** React Imports
import Proptypes from 'prop-types'
import { Row, Col } from 'reactstrap'

const ExtensionsHeader = ({title,link,subTitle}) => {
  return (
    <Row className='mb-2'>
      <Col sm='12' className='ml-50'>
        <p className='font-medium-5 font-weight-bold mt-1 extension-title' data-tour='extension-title'>
          {title}
        </p>
        {link? (
          <a href={link} target='_blank' rel='noopener noreferrer'>
            {subTitle}
          </a>
        ) : (
          <p className='text-primary'>{subTitle}</p>
        )}
      </Col>
    </Row>
  )
}
export default ExtensionsHeader

// ** PropTypes
// ExtensionsHeader.propTypes = {
//   title: Proptypes.string.isRequired,
//   subTitle: Proptypes.string.isRequired,
//   link: Proptypes.string
// }
