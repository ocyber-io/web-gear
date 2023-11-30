import {JwtDecode, InvalidTokenError} from '../index'; // Update the path accordingly

describe('JwtDecode', () => {
    it('should decode a valid token', () => {
        // Mock a valid JWT token (header and payload) for testing purposes
        const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.';

        // Create an instance of JwtDecode
        const jwtDecoder = new JwtDecode<{ sub: string; name: string }>(mockToken);

        // Assert the decoded headers and payload
        expect(jwtDecoder.headers).toEqual({
            typ: 'JWT', alg: 'HS256', kid: '1234567890'
        });

        expect(jwtDecoder.payload).toEqual({
            sub: '1234567890', name: 'John Doe', iat: 1516239022
        });
    });

    it('should throw InvalidTokenError for null token', () => {
        expect(() => {
            new JwtDecode(null);
        }).toThrow(InvalidTokenError)
    });

    it('should throw InvalidTokenError for invalid token', () => {
        const invalidToken = 'invalidToken';
        expect(() => {
            new JwtDecode(invalidToken)
        }).toThrow(InvalidTokenError);
    });

    it('should throw InvalidTokenError for invalid base64 in token parts', () => {
        // Mock a token with invalid base64 in parts for testing purposes
        const invalidBase64Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAifQ.invalid.Payload';

        // Assert that creating a JwtDecode instance with a token containing invalid base64 throws InvalidTokenError
        expect(() => {
            new JwtDecode(invalidBase64Token)
        }).toThrow(InvalidTokenError);
    });

    it('should throw InvalidTokenError for invalid Header base64 in token parts', () => {
        // Mock a token with invalid base64 in parts for testing purposes
        const invalidHeaderToken = 'Header.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.';

        // Assert that creating a JwtDecode instance with a token containing invalid base64 throws InvalidTokenError
        expect(() => {
            new JwtDecode(invalidHeaderToken)
        }).toThrow(InvalidTokenError);
    });

    it('should throw InvalidTokenError for invalid Payload base64 in token parts', () => {
        // Mock a token with invalid base64 in parts for testing purposes
        const invalidPayloadToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAifQ.Payload.';

        // Assert that creating a JwtDecode instance with a token containing invalid base64 throws InvalidTokenError
        expect(() => {
            new JwtDecode(invalidPayloadToken)
        }).toThrow(InvalidTokenError);
    });

    it('should handle token parts with incorrect lengths', () => {
        // Mock a token with parts of incorrect lengths for testing purposes
        const tokenWithIncorrectLengths = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'; // Missing the last part

        // Assert that creating a JwtDecode instance with a token with incorrect part lengths throws InvalidTokenError
        expect(() => {
            new JwtDecode(tokenWithIncorrectLengths)
        }).toThrow(InvalidTokenError);
    });
});
