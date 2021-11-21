module.exports.prompts = {
  prompt: async (name, messages) => {
    return `${name} and some people were having a conversation about:

"""
${messages}
"""
tl;dr:
"""
`;
  },
};
