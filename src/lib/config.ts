const getApiUrl = () => {
    if (typeof window === 'undefined') {
        return 'http://host.docker.internal/api/v1';
    }
    
    return '/api/v1';
};

const config = {
    api: {
        baseUrl: getApiUrl()
    }
};

export default config;
