const getApiUrl = () => {
    if (typeof window === 'undefined') {
        return 'http://172.18.0.1/api/v1';
    }
    
    return '/api/v1';
};

const config = {
    api: {
        baseUrl: getApiUrl()
    }
};

export default config;
