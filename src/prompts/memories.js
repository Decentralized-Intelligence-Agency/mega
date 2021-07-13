module.exports.prompts = {
  prompt: async (name, messages) => {
    return `${name} and some people were having a conversation, my students asked me what they were talking about:
"""
${messages}
"""
The above was a conversation between ${name} and the people.
I wrote an explanation of the conversation below.
I explained to my students in plain english what the conversation was about:
"""
The conversation was about`;
  },
};
