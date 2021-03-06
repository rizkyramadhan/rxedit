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


// CREATE
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

// MOVING
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

// IMPORT
test('Add Import', async() => {
  const res = await axios.post(`${url}/add-import`,{
      path: newfile,
      from: "FROM",
      default :"DEFAULT",
      named: [{name:"useEffect", alias: "useEffect"}]
  })
  expect(res.data).toEqual('ok');
})

test('Edit Import', async() => {
  const res = await axios.post(`${url}/edit-import`,{
      path: newfile,
      from: "FROM",
      default :"DEFAULT",
      named: [{name:"Ganti"},{name:"Ini", alias: "Ini2"}]
  })
  expect(res.data).toEqual('ok');
})



test('Delete Import', async() => {
  const res = await axios.post(`${url}/del-import`,{
      path: newfile,
      from: "FROM"
  })
  expect(res.data).toEqual('ok');
})

// VARIABLE EDITOR
test('Add Variable', async() => {
  const res = await axios.post(`${url}/add-var`,{
      path: newfile,
      name: 'nar',
      init: '00',
      type: 'String'
  })
  expect(res.data).toEqual('ok');
})
test('Edit Variable', async() => {
  const res = await axios.post(`${url}/edit-var`,{
      path: newfile,
      name: 'nar',
      newname:'newVar',
      init: '00',
      type: 'String'
  })
  expect(res.data).toEqual('ok');
})

test('Set Variable Export', async() => {
  const res = await axios.post(`${url}/set-var-export`,{
      path: newfile,
      name: "newVar",
      export: true
  })
  expect(res.data).toEqual('ok');
})

test('delete Variable', async() => {
  const res = await axios.post(`${url}/del-var`,{
      path: newfile,
      name: 'newVar'
  })
  expect(res.data).toEqual('ok');
})

// FUNCTION
test('Add Function', async() => {
  const res = await axios.post(`${url}/add-function`,{
      path: newfile,
      name: "newFun",
        params: [{name: "sing", type:"Any"}],
        returnType: "Any",
        statements:["let a = 1","a++"]
  })
  expect(res.data).toEqual('ok');
})

test('Edit Function', async() => {
  const res = await axios.post(`${url}/edit-function`,{
      path: newfile,
      name: "newFun",
      newname:"newerFun",
        params: [{name: "song", type:"Any"}],
        returnType: "String",
        statements:["let a = 1","++a"]
  })
  expect(res.data).toEqual('ok');
})



test('Set Function Export', async() => {
  const res = await axios.post(`${url}/set-func-export`,{
      path: newfile,
      name: "newerFun",
      params: [{name: "sing", type:"Any"}],
      export: true
  })
  expect(res.data).toEqual('ok');
})

test('Call function', async() => {
  const res = await axios.post(`${url}/call-function`,{
      path: newfile,
      function: "newerFun",
      params: "'haloo'"
  })
  expect(res.data).toEqual('ok');
})

test('Del call function', async() => {
  const res = await axios.post(`${url}/del-call-function`,{
      path: newfile,
      function: "newerFun",
      params: "'haloo'"
  })
  expect(res.data).toEqual('ok');
})



//STATEMENT
test('Add Statement', async() => {
  const res = await axios.post(`${url}/add-statement`,{
      path: newfile,
      statement: "return a"
  })
  expect(res.data).toEqual('ok');
})

test('Insert Statement', async() => {
  const res = await axios.post(`${url}/insert-statement`,{
      path: newfile,
      index:2,
      statement: "const a :String = 'inserted statement'"
  })
  expect(res.data).toEqual('ok');
})

test('Delete Statement Function', async() => {
  const res = await axios.post(`${url}/del-statement`,{
      path: newfile,
      index:4
  })
  expect(res.data).toEqual('ok');
})

//STATEMENT IN FUNCTION
test('Add Statement Function', async() => {
  const res = await axios.post(`${url}/add-statement-function`,{
      path: newfile,
      function: "newerFun",
      statement: "return a;"
  })
  expect(res.data).toEqual('ok');
})

test('Insert Statement Function', async() => {
  const res = await axios.post(`${url}/insert-statement-function`,{
      path: newfile,
      function: "newerFun",
      index:0,
      statement: "const a :String = 'inserted statement'"
  })
  expect(res.data).toEqual('ok');
})

test('Delete Statement Function', async() => {
  const res = await axios.post(`${url}/del-statement-function`,{
      path: newfile,
      function: "newerFun",
      index:0
  })
  expect(res.data).toEqual('ok');
})


// //STATEMENT IN DEFAULT
test('Add Statement Default', async() => {
  const res = await axios.post(`${url}/add-statement-default`,{
      path: newfile,
      statement: "const a = 'added statement'"
  })
  expect(res.data).toEqual('ok');
})

test('Insert Statement Default', async() => {
  const res = await axios.post(`${url}/insert-statement-default`,{
      path: newfile,
      index:0,
      statement: "const a :String = 'inserted statement'"
  })
  expect(res.data).toEqual('ok');
})

test('Delete Statement Default', async() => {
  const res = await axios.post(`${url}/del-statement-function`,{
      path: newfile,
      index:0
  })
  expect(res.data).toEqual('ok');
})

//GET MODULE & EXPORT
test('Get Module', async() => {
  const res = await axios.post(`${url}/get-module`,{
    path: newfile,
    search: "Comp7"
  })
  expect(typeof res.data).toBe('object');
})

test('Get Export Module', async() => {
  const res = await axios.post(`${url}/get-export-from-module`,{
    path: newfile,
    search: ""
  })
  expect(typeof res.data).toBe('object');
})
//////////

//DELETE

test('Delete Function', async() => {
  const res = await axios.post(`${url}/del-function`,{
      path: newfile,
      name: "newerFun"
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

test('get source file for first component', async () => {
  let path = _.get(list, 'children.0.relativePath');
  
  if (path) {
    const res = await axios.post(`${url}/source`, {
      path
    });
    expect(typeof res.data).toBe('object');
  }
});
