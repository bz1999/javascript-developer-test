const { httpGet } = require('./mock-http-interface');

// Fetch all URLs in parallel and map each response to an Arnie quote or failure
const getArnieQuotes = async (urls) => {
  const promises = urls.map((url) => httpGet(url));
  const results = await Promise.allSettled(promises);

  return results.map((result) => {
    if (result.status === 'fulfilled') {
      return mapHttpResponseToQuoteResult(result.value);
    } else {
      const { reason } = result;
      const message =
        reason instanceof Error ? reason.message : String(reason);

      return { FAILURE: message };
    }
  });
};

const mapHttpResponseToQuoteResult = ({ status, body }) => {
  const { message } = JSON.parse(body);
  return status === 200
    ? { 'Arnie Quote': message }
    : { FAILURE: message };
};

module.exports = {
  getArnieQuotes,
};
