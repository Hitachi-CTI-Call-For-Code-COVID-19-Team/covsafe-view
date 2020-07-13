/*
Copyright 2020 Hitachi Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import BarLoader from 'react-spinners/BarLoader';
import classNames from 'classnames';
import { css } from "@emotion/core";

const override = css`
  display: block;
  margin: 0 auto;
`;

const Loading = (props) => {
  const { loading, classes } = props;
  return (
    <div className={classNames('mt-5', classes)}>
      <BarLoader
        css={override}
        width={150}
        color={'#999999'}
        loading={loading}
      />
      <div className='text-center mt-4'>Please Wait. Loading...</div>
    </div>
  );
};

export { Loading };
