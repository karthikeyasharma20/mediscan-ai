function HealthCard({ title,value,color }){

return(

<div
style={{
background:color,
padding:"20px",
borderRadius:"10px"
}}
>

<h3>

{title}

</h3>

<h1>

{value}

</h1>

</div>

);

}

export default HealthCard;