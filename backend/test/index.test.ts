import axios from 'axios';
import _ from 'lodash';

const url = 'http://localhost:4000';
let list: any[] = [];
const newfile = './Comp' + (Math.floor(Math.random() * 999999) + 1) + '.tsx';
const newdir = './CompTest' + (Math.floor(Math.random() * 999999) + 1);
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
    from: "./bisaginiy/Comp381635.tsx" ,
    to: "./Comp381635.tsx"
  });
  expect(res.data).toEqual('ok');

  const res1 = await axios.post(`${url}/move`, {
    from: "./Comp381635.tsx" ,
    to: "./bisaginiy/Comp381635.tsx"
  });
  expect(res1.data).toEqual('ok');

  const res2 = await axios.post(`${url}/move`, {
    from: "./bisaginiy/Comp381635.tsx",
    to: "./IniBisa/Comp381635.tsx"
  });
  expect(res2.data).toEqual('ok');

  const res3 = await axios.post(`${url}/move`, {
    from: "./IniBisa/Comp381635.tsx",
    to: "./bisaginiy/Comp381635.tsx"
  });
  expect(res3.data).toEqual('ok');

})


test('move to same directory', async() => {
  const res = await axios.post(`${url}/move`, {
    from: "./JosMantab.tsx" ,
    to: "./JosMantab.tsx"
  });
  expect(res.data).toEqual('ok');
})

test('moving directory', async() => {
  const res = await axios.post(`${url}/move`, {
    from: "./MoveIt" ,
    to: "./bisaginiy/MoveIt"
  });
  expect(res.data).toEqual('ok');

  const res1 = await axios.post(`${url}/move`, {
    from: "./bisaginiy/MoveIt" ,
    to: "./MoveIt"
  });
  expect(res1.data).toEqual('ok');
})

// test('Delete newfile', async() => {
//   const res = await axios.post(`${url}/del`,{
//       path: newfile
//   })
//   expect(res.data).toEqual('ok');
// })

test('Delete newdir', async() => {
  const res = await axios.post(`${url}/del`,{
      path: newdir
  })
  expect(res.data).toEqual('ok');
})

test('Add Import', async() => {
  const res = await axios.post(`${url}/add-import`,{
      path: newfile
  })
  expect(res.data).toEqual('ok');
})