import { jest } from '@jest/globals';

global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

const {getFields} = await import('../funkkarit/fields.js');


describe('getFields', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

    //  tulostaa console.erroriin
    test('palautetaan null kun ei ole viitetyyppiä', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(""));
      const expectedResult = null;
      const result = await getFields("");
      expect(result).toEqual(expectedResult);
      expect(fetch).toHaveBeenCalledWith("https://ohtuminiprojektiryhm-10-backend.onrender.com/maarittelyt", {
        method: "POST",
        body: JSON.stringify({"viitetyyppi": ""}), 
        headers: { "Content-Type": "application/json" }
      });
  });

  test('palautetaan kirjan kentät', async () => {
    const expectedResult = {"fields": [
	    "author",
            "title",
	    "publisher",
            "year",
            "doi"
    ]};
    fetch.mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve(expectedResult),	// onko ihan tyhmää?
      ok: true,
      status: 200
    }));
    const result = await getFields("book");
    expect(result).toEqual(expectedResult);
    expect(fetch).toHaveBeenCalledWith("https://ohtuminiprojektiryhm-10-backend.onrender.com/maarittelyt", {
      method: "POST",
      body: JSON.stringify({"viitetyyppi": "book"}), 
      headers: { "Content-Type": "application/json" }
      });
  });

});

