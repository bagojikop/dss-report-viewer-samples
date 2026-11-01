import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const read=path=>readFile(resolve(root,path),'utf8');
const queryMap=JSON.parse(await read('api/report-query-map.json'));
const definitions=[
 ['report-builder','report-builder-demo.component.ts',['docs/GuideDemo.rdl','docs/GuideDetails.rdl']],
 ['report-tabs','report-tabs-demo.component.ts',['drillthrough/Invoices.rdl','drillthrough/InvoiceDetails.rdl','drillthrough/CustomerSummary.rdl']],
 ['textbox-actions','textbox-actions-report.component.ts',['TextboxActions.rdl','drillthrough/InvoiceDetails.rdl','drillthrough/CustomerSummary.rdl']],
 ['charts','charts-report.component.ts',(await readdir(resolve(root,'api/Reports/charts'))).filter(n=>n.endsWith('.rdl')).map(n=>'charts/'+n)],
 ['visuals','visuals-report.component.ts',(await readdir(resolve(root,'api/Reports/visuals'))).filter(n=>n.endsWith('.rdl')).map(n=>'visuals/'+n)],
];
const files={};const examples={};
function formatRdl(xml){
 let depth=0;
 return xml.replace(/>\s*</g,'>\n<').split('\n').map(line=>{
  const text=line.trim();
  if(/^<\//.test(text))depth=Math.max(0,depth-1);
  const result='  '.repeat(depth)+text;
  if(/^<[^/!?]/.test(text)&&!(/\/>$/.test(text)||/<\//.test(text)))depth++;
  return result;
 }).join('\n');
}
async function add(path,kind,report){
 if(!files[path]){
  let content=await read(path);
  // Publish report definitions without saved connection credentials.
  if(kind==='RDL')content=content.replace(/(<(?:\w+:)?ConnectString\b[^>]*>)[\s\S]*?(<\/(?:\w+:)?ConnectString>)/gi,'$1DEMO_CONNECTION$2');
  if(kind==='RDL')content=formatRdl(content);
  files[path]={path,kind,content};
 }
 return {path,kind,report};
}

// Publish illustrative, schema-specific setup templates; the live demo stays JSON-backed.
function sqlExamples(route,reports,entries){
 const sqlSet={},procedureSet={};
 for(const report of reports){
  const xml=files['api/Reports/'+report].content;
  for(const match of xml.matchAll(/<DataSet\s+Name="([^"]+)"[^>]*>([\s\S]*?)<\/DataSet>/g)){
   const name=match[1];if(sqlSet[name])continue;
   const safe=name.replace(/[^a-zA-Z0-9_]/g,'_');
   const fields=[...match[2].matchAll(/<DataField>([^<]+)<\/DataField>/g)].map(m=>'['+m[1].replaceAll(']',']]')+']');
   const query='SELECT '+(fields.length?fields.join(', '):'*')+'\nFROM [dbo].[YourTable];';
   const sqlPath='integration/'+route+'/'+safe+'.sql';
   const procedurePath='integration/'+route+'/Get_'+safe+'.sql';
   files[sqlPath]={path:sqlPath,kind:'SQL',content:'-- SETUP TEMPLATE ONLY. Not executed by the preview.\n-- Replace YourTable, validate columns, and add parameterized filters.\n-- Save under ReportSqlRoot (default Sql), or configure EmbeddedSqlSources.\n'+query};
   files[procedurePath]={path:procedurePath,kind:'Procedure',content:'-- SETUP TEMPLATE ONLY. Adapt and deploy to SQL Server.\n-- Add procedure parameters and matching typed map definitions as needed.\nCREATE OR ALTER PROCEDURE [dbo].[Get_'+safe+']\nAS\nBEGIN\n  SET NOCOUNT ON;\n  '+query+'\nEND;'};
   entries.push({path:sqlPath,kind:'SQL'},{path:procedurePath,kind:'Procedure'});
   sqlSet[name]={sqlFile:safe+'.sql',parameters:{}};
   procedureSet[name]={storedProcedure:'dbo.Get_'+safe,parameters:{}};
  }
 }
 for(const [kind,set,suffix] of [['SQL',sqlSet,'sql'],['Procedure',procedureSet,'procedure']]){
  const path='integration/'+route+'/'+suffix+'/report-query-map.json';
  files[path]={path,kind,content:JSON.stringify({reports:Object.fromEntries(reports.map(report=>[report,route])),querySets:{[route]:set}},null,2)};
  entries.push({path,kind});
 }
}

const allowed=/^(demo_|payslip_|warehouse_|chart_gallery\.json$|visual_|textbox_actions_demo\.json$|pagination_demo\.json$)/;
for(const [route,component,reports] of definitions){
 const entries=[await add('web/src/app/reports/'+component,'Angular'),await add('web/src/app/app.config.ts','Angular'),await add('web/src/app/report-api.config.ts','Angular'),await add('web/public/aa.config.json','Configuration')];
 if(route==='textbox-actions'||route==='report-builder')entries.push(await add('web/src/app/reports/invoice-action-form.component.ts','Angular'));
 if(route==='charts')entries.push(await add('web/src/app/reports/chart-catalog.ts','Angular'));
 if(route==='visuals')entries.push(await add('web/src/app/reports/visual-catalog.ts','Angular'));
 const datasets={};
 for(const report of reports){
  entries.push(await add('api/Reports/'+report,'RDL',report));
  const xml=files['api/Reports/'+report].content;
  for(const match of xml.matchAll(/<DataSet\s+Name="([^"]+)"/g)){
   const name=match[1],file=queryMap.querySets[queryMap.reports[report]]?.[name]?.jsonFile;
   if(file&&allowed.test(file)){
    datasets[name]=file;
    const path='api/Data/'+file;
    if(!entries.some(e=>e.path===path))entries.push(await add(path,'JSON'));
   }
  }
 }
 sqlExamples(route,reports,entries);
 const path='configuration/'+route+'/report-query-map.json';
 files[path]={path,kind:'Configuration',content:JSON.stringify({reports:Object.fromEntries(reports.map(report=>[report,route])),querySets:{[route]:Object.fromEntries(Object.entries(datasets).map(([name,file])=>[name,{jsonFile:file}]))}},null,2)};
 entries.push({path,kind:'Configuration'});
 examples['/reports/'+route]=entries;
}


const catalog=JSON.stringify({examples,files});
// The UI loads the sample catalog as a lazy application bundle.

await writeFile(resolve(root,'web/src/app/reports/sample-sources.generated.ts'),
 '// Generated by npm run sources. Do not edit.\nexport default JSON.parse('+JSON.stringify(catalog)+') as unknown;\n');
console.log(`Published source for ${definitions.length} examples (${Object.keys(files).length} files), using fictional fixtures and dataset-only configuration.`);
