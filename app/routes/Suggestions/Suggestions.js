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

/*
MIT License

Copyright (c) 2019 Tomasz O.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Container,
  Row,
  Card,
  CardBody,
  Badge,
  Table,
  CardTitle,
  Progress,
  Col
} from './../../components';
import { setupPage } from './../../components/Layout/setupPage';
import { HeaderMain } from "../components/HeaderMain";

import {
  TrSystem
} from "./../Dashboards/System/components/trSystem";

const TrColors = [
  {
    fill: "primary-02",
    stroke: "primary"
  },
  {
    fill: "purple-02",
    stroke: "purple"
  },
  {
    fill: "success-02",
    stroke: "success"
  },
  {
    fill: "yellow-02",
    stroke: "yellow"
  }
];

class Suggestions extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <Container>
        <Row className="mb-2">
          <Col lg={12}>
            <HeaderMain
              title={t('menus:main.suggestions.title')}
              className="mb-4 mb-lg-5"
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Areas</th>
                  <th>ANSHIN Index</th>
                  <th>Suggestions</th>
                </tr>
              </thead>
              <tbody>
                <TrSystem
                  colors={TrColors}
                />
                <TrSystem
                  colors={TrColors}
                />
                <TrSystem
                  colors={TrColors}
                />
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

const withPageSettings = setupPage({ pageTitle: 'Individual Anlytics' })(Suggestions);
const SuggestionsWithTranslation = withTranslation()(withPageSettings);
export { SuggestionsWithTranslation as Suggestions };
