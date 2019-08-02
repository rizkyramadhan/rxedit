import axios from 'axios';
import _ from 'lodash';

const url = 'http://localhost:4000';
let list: any[] = [];
const newfile = './Comp' + (Math.floor(Math.random() * 999999) + 1) + '.tsx';
test('list result is object', async () => {
  const res = await axios.get(`${url}/list`);
  list = res.data;
  expect(typeof res.data).toBe('object');
});

test('get source file for first component', async () => {
  let path = _.get(list, 'children.0.relativePath');
  if (path) {
    const res = await axios.post(`${url}/source`, {
      path
    });
    expect(typeof res.data).toBe('object');
  }
});

test('create new component with random name at root directory', async () => {
  const res = await axios.post(`${url}/new-file`, {
    path: newfile
  });
  expect(res.data).toEqual('ok');
});

test('create new component with same name at root directory', async () => {
  try {
    const res = await axios.post(`${url}/new-file`, {
      path: newfile
    });
    expect(res.status).toEqual(500);
  } catch (e) {}
});
