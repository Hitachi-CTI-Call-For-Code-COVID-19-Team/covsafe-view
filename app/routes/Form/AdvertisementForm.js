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
import Toggle from 'react-toggle';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import Fetch from '../../utils/fetch';
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  UncontrolledModal,
  ModalHeader,
  ModalBody,
} from './../../components';
import { HeaderMain } from './../components/HeaderMain';
import { AddonInput } from './components';

class AdvertisementForm extends React.Component {
  constructor(props) {
    super(props);

    const now = new Date();
    this.state = {
      title: '',
      date: {
        start: now,
        end: new Date((new Date(now)).getTime() + 1000 * 60 * 60 * 5),
      },
      content: '',
      file: undefined,
      media: {},
      mediaToggle: {},
      uploading: undefined,
    };
  }

  componentDidMount() {
    new Fetch(process.env.PUBLIC_API_DOCS, {
      method: 'post',
      headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
      body: JSON.stringify({
        dbname: process.env.VIEW_CONFIG_DB,
        query: {
          selector: {},
          fields: ['form'],
        }
      }),
    })
      .fetch()
      .then(res => res.json())
      .then(res => res.docs[0])
      .then(res => {
        this.setState({
          media: res.form.media,
          mediaToggle: (() => Object.keys(res.form.media).sort().reduce((p, v) => {
            p[v] = true;
            return p;
          }, {}))(),
        });
      })
      .catch(e => {
        console.error(`cannot fetch config: ${e}`);
      });
  }

  send(e) {
    e.preventDefault();

    if (this.state.uploading) {
      return;
    }
    
    // upload file first
    this.setState({
      uploading: 'IMAGE FILE IS BEING UPLOADED...',
    });
    const formData = new FormData();
    formData.append('file', this.state.file, this.state.file.name);
    formData.append('metadata', new Blob([JSON.stringify({
      bucket: process.env.STATIC_FILES_BUCKET,
      key: this.state.file.name,
    })], {
      type: 'application/json'
    }));

    new Fetch(process.env.PRIVATE_API_FILES, {
      method: 'post',
      headers: { 'x-ibm-client-id': process.env.PRIVATE_API_KEY },
      body: formData,
    })
      .fetch()
      .then(res => res.json())
      .then(res => {
        if (res.bucket !== process.env.STATIC_FILES_BUCKET || res.key !== this.state.file.name) {
          throw new Error('something wrong. it didnot write a file in a correct location');
        }

        // send metadata
        this.setState({
          uploading: 'CONTENTS ARE BEING UPLOADED...',
        });
        new Fetch(process.env.PRIVATE_API_DOCS, {
          method: 'post',
          headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PRIVATE_API_KEY },
          body: JSON.stringify({
            dbname: process.env.ADVERTISEMENT_DB,
            doc: {
              title: this.state.title,
              start: this.state.date.start,
              end: this.state.date.end,
              contents: this.state.content,
              image: {
                url: `${process.env.PUBLIC_API_FILES}`,
                options: {
                  method: 'post',
                  headers: { 'content-type': 'application/json', },
                  body: `{"bucket": "${process.env.STATIC_FILES_BUCKET}", "key": "${this.state.file.name}"}`,
                },
              },
              media: this.state.mediaToggle,
            }
          }),
        })
          .fetch()
          .then(res => res.json())
          .then(res => {
            document.querySelector(`#uploadmodal`).click();
            this.setState({
              uploading: undefined,
            });

            if (!res.ok) {
              throw new Error(`failed to send metadata of ${this.state.file.name}`);
            }

          })
          .catch(e => {
            console.error(`failed to send data: ${e}`);
          });
      })
      .catch(err => console.error(err));
  }

  handleChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  handleChangeContent(e) {
    this.setState({
      content: e.target.value,
    });
  }

  handleChangeFile(e) {
    this.setState({
      file: e.target.files[0],
    });
  }

  toggleMediaSwitch(key, current) {
    const obj = _.clone(this.state.mediaToggle);
    obj[key] = !current;

    this.setState({
      mediaToggle: obj,
    });
  }

  handleChangeStartDate(set, e) {
    const date = _.clone(this.state.date);
    date.start = set;
    if (set > date.end) {
      date.end = set;
    }

    this.setState({
      date: date,
    });
  }

  handleChangeEndDate(set, e) {
    const date = _.clone(this.state.date);
    date.end = set;

    this.setState({
      date: date,
    });
  }

  render() {
    const { t } = this.props;
    const { media, mediaToggle } = this.state;

    return (
      <React.Fragment>
        <Container>
          <HeaderMain
            title={t('uploader:title')}
            className='mb-2 mt-4'
          />
          <Row className='mb-4'>
            <Col lg={12}>
              {t('uploader:explain')}
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card className="mb-3">
                <CardBody>
                  <Form onSubmit={this.send.bind(this)}>
                    <FormGroup row className='my-3'>
                      <Label for='title' sm={3}>{t('uploader:form.title')}</Label>
                      <Col sm={9}>
                        <Input
                          type=''
                          name='title'
                          id='title'
                          value={this.state.title}
                          placeholder={t('uploader:form.placeholder.title')}
                          onChange={this.handleChangeTitle.bind(this)}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row className='my-3'>
                      <Label for='date' sm={3}>{t('uploader:form.date')}</Label>
                      <Col sm={9}>
                        <div className="d-flex">
                          <DatePicker
                            // locale="en-GB"
                            customInput={<AddonInput />}
                            minDate={new Date()}
                            selected={this.state.date.start}
                            selectsStart
                            startDate={this.state.date.start}
                            endDate={this.state.date.end}
                            showTimeSelect
                            dateFormat='Pp'
                            onChange={this.handleChangeStartDate.bind(this)}
                          />
                          <div className='mx-2' style={{display: 'flex', alignItems: 'center'}}>
                            <i className='fa fa-fw fa-minus'></i>
                          </div>
                          <DatePicker
                            // locale="en-GB"
                            customInput={<AddonInput />}
                            minDate={new Date()}
                            selected={this.state.date.end}
                            selectsEnd
                            startDate={this.state.date.start}
                            endDate={this.state.date.end}
                            showTimeSelect
                            dateFormat='Pp'
                            onChange={this.handleChangeEndDate.bind(this)}
                          />
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row className='my-3'>
                      <Label for='content' sm={3}>{t('uploader:form.content')}</Label>
                      <Col sm={9}>
                        <Input
                          type='textarea'
                          name="text"
                          id='content'
                          value={this.state.content}
                          placeholder={t('uploader:form.placeholder.content')}
                          onChange={this.handleChangeContent.bind(this)}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row className='my-3'>
                      <Label for='file' sm={3}>{t('uploader:form.upload')}</Label>
                      <Col sm={9}>
                        <Input
                          type='file'
                          name='file'
                          id='file'
                          onChange={this.handleChangeFile.bind(this)}
                        />
                        <FormText color='muted'>{t('uploader:form.placeholder.upload')}</FormText>
                      </Col>
                    </FormGroup>
                    <FormGroup row className='my-3'>
                      <Label for='checkbox' sm={3}>{t('uploader:form.select')}</Label>
                      <Col sm={9}>
                        {
                          Object.keys(media).length && Object.keys(mediaToggle).sort().map((m, i) => (
                            <label key={i} className="d-flex align-items-middle my-3">
                              <Toggle
                                defaultChecked={mediaToggle[m]}
                                onChange={() => this.toggleMediaSwitch(m, mediaToggle[m])} />
                              <span className="ml-3">{media[m]}</span>
                            </label>
                          ))
                        }
                      </Col>
                    </FormGroup>
                    <Button
                      id='uploadmodal'
                      color='primary'
                      className='mt-4'
                      type='submit'>
                      {t('uploader:form.button')}
                    </Button>

                    <UncontrolledModal
                      target='uploadmodal'
                      className='modal-dark'
                      style={{ backgroundColor: '#ffffffa6 !important'}}>
                      <ModalHeader className='py-3' />
                      <ModalBody className='table-light text-center px-5'>
                        <i className='fa fa-5x fa-circle-o-notch fa-spin fa-fw modal-icon mb-3'></i>
                        <h6>{this.state.uploading}</h6>
                      </ModalBody>
                    </UncontrolledModal>

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
