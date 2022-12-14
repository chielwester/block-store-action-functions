const subAction = async ({
  app_identifier,
  app_id,
  jwt,
  action_id,
  input,
  runInBackground,
}) => {
  console.debug(
    `${new Date().toLocaleString(
      'nl-NL',
    )} - Running action ${app_identifier}/${action_id}`,
  );

  const inputMapping = input.reduce((prevMap, { key, value }) => {
    const newMap = {
      ...prevMap,
      [key]: value,
    };

    return newMap;
  }, {});

  if (runInBackground) {
    fetch(`https://${app_identifier}.betty.app/api/runtime/${app_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jwt ? { Authorization: jwt } : {}),
      },
      body: JSON.stringify({
        query: `
        mutation { 
          action(id: "${action_id}", input: $input)
        }
      `,
        variables: {
          input: inputMapping,
        },
      }),
    });
  } else {
    await fetch(`https://${app_identifier}.betty.app/api/runtime/${app_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jwt ? { Authorization: jwt } : {}),
      },
      body: JSON.stringify({
        query: `
        mutation { 
          action(id: "${action_id}", input: $input)
        }
      `,
        variables: {
          input: inputMapping,
        },
      }),
    });
  }
};

export default subAction;
