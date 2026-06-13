export async function FilterJobs(filters,jobs=[],search,jobId){
   if(jobId !== ""){

    return jobs.filter((job)=>(job.id === jobId));
   }

    function applyFilter(value,type){
if(value!== "any" && value !== "Anywhere"){
    if(type === 'salary' ){
        if(value !== 'other'){
        jobs= jobs.filter((job)=>{
            return +job[type+'1'] >= +value})
    }}
    else{
   jobs= jobs.filter((job)=>{
    return job[type] ===value}); 
        }}
    }

    const objectMap = (obj, fn) =>
    Object.fromEntries(
      Object.entries(obj).map(
        ([k, v], i) => [k, fn(v, k, i)]
      )
    
    )
  objectMap(filters,applyFilter);
 
  if(search){
  if(search !== ""){
   console.log(search);
    jobs=jobs.filter((job)=>job.title.toLowerCase().match(search.toLowerCase()));
  }}
 
  return jobs;
};

const addJobHandler=()=>{

}
