import React from 'react';
import './WeightForm.less';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.less';

export default class LogWeight extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      edit: (this.props.inputWeight != "")
    }
    
    this.handleChangeDate = this.props.onDateSelect;
    this.handleChangeInput = this.props.onInput;
    this.handleSubmit = () => {
      this.props.onSubmit()
      this.setState({
        edit:false
      });
    };
  }
  
  handleEdit() {
    this.setState({
      edit: true
    });
  }
  
  hideInput() {
    return this.props.inputWeight != "" && 
      this.props.inputWeight != null &&
      this.props.inputWeight != undefined &&
      !this.state.edit;
  }
  
  render() {
    return (
      <div className="row weight-form">
        <div className = "six columns">
          <label htmlFor="datepicker">Select Date:</label>
          <DatePicker id="datepicker" selected={this.props.selectedDate} onChange={this.handleChangeDate}/>
        </div>
        {
          (this.hideInput()) ?
            <EditButton onClick={this.handleEdit.bind(this)}/> :
            <SubmitForm inputWeight={this.props.inputWeight} handleChangeInput={this.handleChangeInput} handleSubmit={this.handleSubmit}/>
        }
      </div>
    );
  }
}

function SubmitForm(props) {
  return (
    <div className="six columns">
      <label htmlFor="weight-input">Input Weight:</label>
      <input id="weight-input" type="text" value={props.inputWeight} onChange={props.handleChangeInput}/>
      <input className="button-primary button-medium weight-submit" type="submit" value="Submit" onClick={props.handleSubmit}/>
    </div>
  );
}

function EditButton(props) {
  return (
    <div className="six clumns">
      <label>Click to edit:</label>
      <input className="button-primary button-medium weight-submit" type="submit" value="Edit" onClick={props.onClick}/>
    </div>
  );
}