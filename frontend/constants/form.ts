type formType = {
    postCode: string,
    getCode: string,
    funcData: string
}

const form: formType = {

    postCode: `def handler(url, headers, body, data):
    # Method Request Handler
    # body: containing the submitted data
    
    print(f"Received Request: {body}")
    
    return {
        "status": "created",
        "received_data": body,
        "id": "new_123"
    }`,

    getCode: `def handler(url, headers, body, data):
    # data is a dictionary, so use ['key'] access
    current_count = int(data.get('count', 0))
    data['count'] = current_count + 1
    return {
        "message": "Hello from FastDev",
        "stored_data": data['count']
    }`,

    funcData: '{  \n "count":0 \n}'
};

export default form;