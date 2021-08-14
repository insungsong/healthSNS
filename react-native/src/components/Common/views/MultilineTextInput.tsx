import React, {Component} from 'react';
import {TextInput} from 'react-native';
import PropTypes from 'prop-types';

export default class MultilineTextInput extends Component {
  static propTypes = {
    maxLines: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  onChangeText = (text) => {
    const {maxLines, onChangeText} = this.props;
    const lines = text.split('\n');

    if (lines.length <= (maxLines || 1)) {
      onChangeText(text);
      this.setState({value: text});
    }
  };

  render() {
    const {onChangeText, multiline, value, ...other} = this.props;
    return (
      <TextInput
        {...other}
        multiline={true}
        value={this.state.value}
        onChangeText={this.onChangeText}
      />
    );
  }
}
