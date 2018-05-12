import React from 'react';
import ReactDOM from 'react-dom';
import BoxComponent from './components/box-component/box-component';
import BoundingBox from './components/bounding-box/bounding-box';
import './box-model.css';

const boxSizings = ['content-box'/*, 'border-box'*/];
const paddings = [0, /*30,*/ [30, 60, 60, 30]];
const margins = [0, /*30,*/ [30, 60, 60, 30]];

class CenterFinderDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        elements: []
    };

    this.body = document.getElementsByTagName('body')[0];
    this.boxes = [];
  }

  componentDidMount() {
    this.setState({elements: this.boxes.map(box => box.getElement())});
  }

  init() {
    //this.setState({elements: this.boxes.map(box => box.getElement())});
  }

  render() {
    const tests = [];

    boxSizings.forEach((boxSizing) => {
        paddings.forEach((padding) => {
            margins.forEach((margin) => {
                tests.push({
                    boxSizing,
                    padding,
                    margin
                });
            });
        });
    });

    return (
      <div className="box-model-demo" ref={(el) => (this.el = el)}>
        <button
          onClick={this.init.bind(this)}
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            display: 'none'
          }}
        >
          Init
        </button>
        {
          tests.map((test, i) => (
            <BoxComponent
              {...test}
              key={i}
              transform={{
                  x: 300 * i + 20,
                  y: 100,
                  scaleX: .95,
                  scaleY: 1.1,
                  rotate: 15,
                  skewX: 40,
                  skewY: 40
              }}
              ref={el => this.boxes[i] = el}
            />
          ))
        }
        {
            this.state.elements.map((element) => (
                ReactDOM.createPortal(<BoundingBox element={element}/>, this.body)
            ))
        }
      </div>
    );
  }
}

export {CenterFinderDemo};
