import React, { useEffect, useState } from "react";
import "./"

function Message() {
    const name = 'Mother Fucker';
    if (name) 
        return <h1>Hello {name}</h1>;
    return <h1>Hello World</h1>;
}

export default Message;