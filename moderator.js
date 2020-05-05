let fs=require("fs");
require("chromedriver");
let swd=require("selenium-webdriver");
let bldr=new swd.Builder();
let driver =bldr.forBrowser("chrome").build();

let cFile=process.argv[2];
let uToAdd=process.argv[3];

( async function(){
   try{ 
    await driver.manage().setTimeouts({
      implicit:10000,pageLoad:10000  
    });   
    let data=await fs.promises.readFile(cFile);
    let credentials=JSON.parse(data);
    await login(credentials);
   
   
    let dropdown= await driver.findElement(swd.By.css("a[data-analytics=NavBarProfileDropDown]"));
    await dropdown.click();
  
    let adminBtn= await driver.findElement(swd.By.css("a[data-analytics=NavBarProfileDropDownAdministration]"));
    await adminBtn.click();
   await waitloader();
    let managechalenges=await driver.findElements(swd.By.css(".administration header ul li"));
    await managechalenges[1].click();
     await waitloader();
    
let manage=driver.getCurrentUrl();
let questions=require(uToAdd);

// for(let i=0;i<questions.length;i++){
//   await driver.get(manage);
//   await waitloader();
//    await createChallenges(questions[i]);

// }
await driver.get(manage);
await waitloader();



// for(let i=0;i<5;i++){


// await modadd(i,manage);


// }
for(let i=0;i<5;i++){
 
await testcaeadd(5,manage,questions[i]);

}


}

catch(err){
    console.log(err);
}
})();




async function login(credentials){
   let user=credentials.username;
    let pwd=credentials.password;
    let url=credentials.url;
    // let{user,pwd,url}=JSON.parse(data);
    await driver.get(url);
    let unInputwillBe=driver.findElement(swd.By.css("#input-1"));
    let pwdInputwillbe=driver.findElement(swd.By.css("#input-2"));
    let unNpwd=await Promise.all([unInputwillBe,pwdInputwillbe]);
    let usernamesend=unNpwd[0].sendKeys(user);
    let pwdsend=unNpwd[1].sendKeys(pwd);
    await Promise.all([usernamesend,pwdsend]);
    let loginbtn =await driver.findElement(swd.By.css("button[data-analytics=LoginPassword]"));
    await loginbtn.click();
}
async function waitloader (){
 let loader= await driver.findElement(swd.By.css("#ajax-msg"));
 await driver.wait(swd.until.elementIsNotVisible(loader));
}



async function createChallenges(question){
  let createchallenge=await driver.findElement(swd.By.css(".btn.btn-green.backbone.pull-right"));
    await createchallenge.click();
    await waitloader();
  const eSelector=["#name", "textarea.description", "#problem_statement-container .CodeMirror div textarea", "#input_format-container .CodeMirror textarea", "#constraints-container .CodeMirror textarea", "#output_format-container .CodeMirror textarea", "#tags_tag"];

 let ewillbesend=eSelector.map(function(s){
  return driver.findElement(swd.By.css(s));
 })

 let allelements=await Promise.all(ewillbesend);
 let namewilladd=allelements[0].sendKeys(question["Challenge Name"]);
 let descriptionsend=allelements[1].sendKeys(question["Description"]);
 await Promise.all([namewilladd,descriptionsend]);


 await editorhandle("#problem_statement-container .CodeMirror div",allelements[2],question["Problem Statement"]);
 await editorhandle("#input_format-container .CodeMirror div",allelements[3],question["Input Format"]);
 await editorhandle("#constraints-container .CodeMirror div",allelements[4],question["Constraints"]);
 await editorhandle("#output_format-container .CodeMirror div",allelements[5],question["Output Format"]);

 let tagsInput=allelements[6];
 await tagsInput.sendKeys(question["Tags"]);
 await tagsInput.sendKeys(swd.Key.ENTER);
 let savechanges=await driver.findElement(swd.By.css(".save-challenge.btn.btn-green"));
 await savechanges.click();
}




async function editorhandle(id,element,data){
  
 let textareaparent=await driver.findElement(swd.By.css(id));
  
 await driver.executeScript("arguments[0].style.height='10px'",textareaparent);

 await element.sendKeys(data);


}
async function modadd(i,manage){
 await driver.get(manage);
  await waitloader();
  let challengesArray=await driver.findElements(swd.By.css(".backbone.block-center"));
  await challengesArray[i].click();

  let wait=driver.wait(swd.until.elementLocated(swd.By.css("span.tag")));
  //  let adminPageUrl = await challengesArray[i].getAttribute("href");
  //   console.log(adminPageUrl);

  //   await driver.get(adminPageUrl);

   await waitloader();
  let mod=await driver.findElements(swd.By.css(".nav-tabs.nav.admin-tabbed-nav.row li"));
  await mod[1].click();
  let inputmod=await driver.findElement(swd.By.css("#moderator"));
  await inputmod.sendKeys("shubham");
  await mod.sendKeys(swd.Key.ENTER);
  let savechanges=await driver.findElement(swd.By.css(".save-challenge.btn.btn-green"));
 await savechanges.click();
  await waitloader();

}
async function testcaeadd(i,manage,question){
    await driver.get(manage);
  await waitloader();
    let challengesArray=await driver.findElements(swd.By.css(".backbone.block-center"));
  await challengesArray[i].click();

  let wait=driver.wait(swd.until.elementLocated(swd.By.css("span.tag")));
   await waitloader();
   let test=await driver.findElements(swd.By.css(".nav-tabs.nav.admin-tabbed-nav.row li"));
  await test[2].click();
  let n=question["Testcases"].length;
  let page= driver.getCurrentUrl();
  
  for(let j=0;j<n;j++){
    await driver.get(page);
    await waitloader();
  // await  driver.wait(swd.until.elementLocated(swd.By.css("#get-score")));
  let addtestcase=await driver.findElement(swd.By.css(".btn.add-testcase.btn-green"));
  await addtestcase.click();
  await waitloader();
  await driver.wait(swd.until.elementLocated(swd.By.css(".formgroup.horizontal.output-testcase-row.row .CodeMirror textarea")));
  let input=await driver.findElement(swd.By.css(".formgroup.horizontal.input-testcase-row.row .CodeMirror textarea"));
  await editorhandle(".formgroup.horizontal.input-testcase-row.row .CodeMirror div",input,question["Testcases"][j]["Input"]);

   let output=await driver.findElement(swd.By.css(".formgroup.horizontal.output-testcase-row.row .CodeMirror textarea"));
  await editorhandle(".formgroup.horizontal.output-testcase-row.row .CodeMirror div",output,question["Testcases"][j]["Output"]);

  let save=await driver.findElement(swd.By.css(".btn.btn-primary.btn-large.save-testcase"));
  await save.click();
//   let savechanges=await driver.findElement(swd.By.css(".save-challenge.btn.btn-green"));
//  await savechanges.click();
  }
  let savechanges=await driver.findElement(swd.By.css(".save-challenge.btn.btn-green"));
 await savechanges.click();

  await waitloader();

}
