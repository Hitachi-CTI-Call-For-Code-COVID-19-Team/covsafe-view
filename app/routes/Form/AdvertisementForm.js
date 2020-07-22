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
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from './../../components';

import { HeaderMain } from './../components/HeaderMain';

class AdvertisementForm extends React.Component {
  send(e) {
    console.log('submit');
    e.preventDefault();
  }

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <Container>
          <HeaderMain
            title={t('uploader:title')}
            className='mb-2 mt-4'
          />
          <Row className='mb-5'>
            <Col lg={12}>
              {t('uploader:explain')}
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card className="mb-3">
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label for='title' sm={3}>{t('uploader:form.title')}</Label>
                      <Col sm={9}>
                        <Input
                          type=''
                          name='title'
                          id='title'
                          placeholder={t('uploader:form.placeholder.title')}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='content' sm={3}>{t('uploader:form.content')}</Label>
                      <Col sm={9}>
                        <Input
                          type='textarea'
                          name="text"
                          id='content'
                          placeholder={t('uploader:form.placeholder.content')}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='file' sm={3}>{t('uploader:form.upload')}</Label>
                      <Col sm={9}>
                        <Input type='file' name='file' id='file' />
                        <FormText color='muted'>{t('uploader:form.placeholder.upload')}</FormText>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='checkbox' sm={3}>{t('uploader:form.select')}</Label>
                      <Col sm={9}>
                        <CustomInput
                          type='checkbox'
                          id='mobile'
                          label='Mobile'
                          inline
                          defaultChecked
                        />
                        <CustomInput
                          type='checkbox'
                          id='signage1'
                          label='Entrance Signage'
                          inline
                          defaultChecked
                        />
                        <CustomInput
                          type='checkbox'
                          id='signage2'
                          label='Register Signage'
                          inline
                        />
                      </Col>
                    </FormGroup>
                    <Button color='primary' className='mt-4' onClick={this.send}>{t('uploader:form.button')}</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const AdvertisementFormWithTranslation = withTranslation()(AdvertisementForm);
export { AdvertisementFormWithTranslation as AdvertisementForm };
