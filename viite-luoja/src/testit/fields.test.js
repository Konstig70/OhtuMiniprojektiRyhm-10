const {getFields} = await import('../funkkarit/fields.js');


describe('getFields', () => {
    test('palautetaan null kun ei ole viitetyyppiä', () => {
      const result = getFields("");
      expect(result).toBeNull();
  });

  test('palautetaan kirjan kentät', () => {
    const expectedResult = [
	    "author",
      "title",
	    "publisher",
      "year",
      "doi"
    ];
    const result = getFields("book");
    expect(result).toEqual(expectedResult);
  });

});

