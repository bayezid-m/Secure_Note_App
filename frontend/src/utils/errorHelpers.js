export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (error?.data?.errors?.length) {
    return error.data.errors.map((item) => `${item.field}: ${item.message}`).join(' | ');
  }

  return error?.data?.message || error?.message || fallback;
}
