import axios from 'axios';
import _ from 'lodash';

const url = 'http://localhost:4000';
let list: any[] = [];
const dirname=''+(Math.floor(Math.random() * 999999) + 1)
const filename=''+ (Math.floor(Math.random() * 999999) + 1) + '.tsx'
const newfile = './Comp' + filename;
const newdir = './CompTest' + dirname;
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

test('create new unique name directory', async() => {
  const res = await axios.post(`${url}/new-dir`, {
    path: newdir
  });
  expect(res.data).toEqual('ok');
})

test('move multiple times', async() => {

  const res = await axios.post(`${url}/move`, {
    from: newfile ,
    to: newdir+'/'+filename
  });
  expect(res.data).toEqual('ok');

  const res1 = await axios.post(`${url}/move`, {
    from: newdir+'/'+filename ,
    to: newfile
  });
  expect(res1.data).toEqual('ok');

  const res2 = await axios.post(`${url}/move`, {
    from: newfile ,
    to: newdir+'/'+filename
  });
  expect(res2.data).toEqual('ok');

  const res3 = await axios.post(`${url}/move`, {
    from: newdir+'/'+filename ,
    to: newfile
  });
  expect(res3.data).toEqual('ok');

})


test('move to same directory', async() => {
  const res = await axios.post(`${url}/move`, {
    from: newfile ,
    to: newfile
  });
  expect(res.data).toEqual('ok');
})

test('moving directory', async() => {
  const res = await axios.post(`${url}/move`, {
    from: newdir ,
    to: "./bisaginiy/"+dirname
  });
  expect(res.data).toEqual('ok');

  const res1 = await axios.post(`${url}/move`, {
    from: "./bisaginiy/"+dirname ,
    to: newdir
  });
  expect(res1.data).toEqual('ok');
})

test('Add Import', async() => {
  const res = await axios.post(`${url}/add-import`,{
      path: newfile
  })
  expect(res.data).toEqual('ok');
})

test('Delete newfile', async() => {
  const res = await axios.post(`${url}/del`,{
      path: newfile
  })
  expect(res.data).toEqual('ok');
})

test('Delete newdir', async() => {
  const res = await axios.post(`${url}/del`,{
      path: newdir
  })
  expect(res.data).toEqual('ok');
})

