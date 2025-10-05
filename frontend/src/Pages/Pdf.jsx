import React from 'react'

export default function Pdf() {
   const handlePrint = async() => {
    console.log('clicked')
//     try{
//  const response=await fetch('http://localhost:5000/print-sale',{
//       method:'GET',
//          responseType: "blob",
//     })
//     console.log("clicked")
//     const pdfBlob = new Blob([response.data], { type: "application/pdf" });
//     const pdfUrl = URL.createObjectURL(pdfBlob);

//     // Open in new tab for printing
//     window.open(pdfUrl, "_blank");
//     }catch(error){
//       console.log(error)
//     }
window.open('http://localhost:5000/print-sale', '_blank');
   
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' ,border:'1px solid red'}}>
      Pdf Generator
      <button onClick={() => handlePrint()}>Print</button>
    </div>
  )
}
