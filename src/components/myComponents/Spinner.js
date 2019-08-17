import React, { Component } from 'react';
import { PulseLoader } from 'react-spinners';
import { css } from '@emotion/core';

class Spinner extends Component {

  render() {

        const override = css`
            position: fixed;
            margin: auto;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100px;
            height: 50px;
        `;

        return (
            <PulseLoader
                css={override}
                sizeUnit={'px'}
                size={20}
                margin={'5px'}
                color={'#17a2b8'}
            />
        );
  }
}

export default Spinner;
