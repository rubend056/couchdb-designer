import { expect, jest, test } from '@jest/globals';
import fs from 'fs/promises';
import createDeisgnDocument from '../src/createDesignDocument';
import designer from '../src/designer';

jest.mock('fs/promises');
jest.mock('../src/createDesignDocument');

describe('designer', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('success', () => {
        fs.readdir.mockResolvedValue(['egy','kettő','három']);
        createDeisgnDocument.mockImplementation((root) => Promise.resolve(`${root}`));
        return designer('root').then(documents => {
            expect(documents).toEqual(["root/egy","root/kettő","root/három"]);
            expect(fs.readdir.mock.calls.length).toBe(1);
            expect(fs.readdir.mock.calls[0][0]).toBe('root');
            expect(createDeisgnDocument.mock.calls.length).toBe(3);
        });
    });

    test('reject on fs error', () => {
        fs.readdir.mockRejectedValue('fs error');
        return designer('./falseroot').catch(err => {
            expect(err).toBe('fs error');
            expect(fs.readdir.mock.calls.length).toBe(1);
            expect(fs.readdir.mock.calls[0][0]).toBe('./falseroot');
            expect(createDeisgnDocument).not.toHaveBeenCalled();
        });
    });

    test('reject on createDeisgnDocument error', () => {
        fs.readdir.mockResolvedValue(['egy','kettő','három']);
        createDeisgnDocument.mockRejectedValue('document error');
        return designer('./root').catch(err => {
            expect(err).toBe('document error');
            expect(fs.readdir.mock.calls.length).toBe(1);
            expect(fs.readdir.mock.calls[0][0]).toBe('./root');
            expect(createDeisgnDocument.mock.calls.length).toBeLessThan(4);
        });
    });
});