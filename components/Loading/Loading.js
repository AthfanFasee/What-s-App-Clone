/* eslint-disable @next/next/no-img-element */


function Loading() {
    return (
        <center style={{display: "grid", placeItems: "center", height: "100vh"}}>
            <div>
                <img src="https://www.freepnglogos.com/uploads/whatsapp-png-logo-1.png" 
                    alt ="image"
                    style={{ marginBottom: 10 }}
                    height={200}
                />
                <h2>Loading ...</h2>
            </div>
        </center>   
    )
}

export default Loading;
