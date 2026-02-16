import sanitizeHtml from "sanitize-html";

export const sanitizeHtmlMiddleware = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const cleanContent = sanitizeHtml(content, {
    allowedTags: ["b", "i", "u", "strike", "ul", "ol", "li", "div"],
    allowedAttributes: {},
  });

  req.body.content = cleanContent;
  next();
};
