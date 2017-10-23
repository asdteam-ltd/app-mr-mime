describe('rezcaster login', function () {

	it('login form should decline incorrect credentials and show error message', function () {
		browser.get('https://uat.mybookingpal.com/rezcaster/#/login');

		var loginURL = browser.getCurrentUrl();

		element(by.model('credentials.username')).sendKeys('info@blueviews.com1');

		element(by.model('credentials.password')).sendKeys('password12');

		element(by.css('[type="submit"]')).click();


		expect($('.danger-msg').isDisplayed()).toBeTruthy();
		expect(browser.getCurrentUrl()).toEqual(loginURL);

	});

	it('login form should accept correct credentials', function () {
		browser.get('https://uat.mybookingpal.com/rezcaster/#/login');

		var loginURL = browser.getCurrentUrl();

		element(by.model('credentials.username')).sendKeys('info@blueviews.com');
		element(by.model('credentials.password')).sendKeys('password');
		element(by.css('[type="submit"]')).click();

		expect(browser.getCurrentUrl()).not.toEqual(loginURL);
	});



});