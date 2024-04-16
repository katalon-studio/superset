const Handlebars = require("handlebars");
const fs = require("fs");

function generateSQLQueryTemplate(input) {
  let templateSource = `
  SELECT
  {{#each input.select}}
    {% if get_filters('profile', remove_filter=True) %}
      {{{this.column}}} AS {{{this.alias}}}{{#unless @last}},{{/unless}}
    {% else %}
        NULL AS {{{this.alias}}}{{#unless @last}},{{/unless}}
    {% endif %}

  {{/each}}

  FROM {{input.from.table}} AS {{input.from.alias}}


  {{#each input.join}}
  {% if {{#each filterNames}}get_filters('{{{this}}}', remove_filter=True) {{#unless @last}}or {{/unless}}{{/each}}%}
      JOIN {{{this.table}}} AS {{{this.alias}}} ON {{{this.condition}}}
  {% endif %}
  {{/each}}


  WHERE 1=1
  {{#each input.where}}
  {% for filter in get_filters('{{{this.name}}}', remove_filter=True) %}
      {% if filter.get('op') == '{{{this.operator}}}' %}
          AND {{{this.column}}} = \\{{ "'" + filter.get('val')[0] + "'" \}}
      {%- endif -%}
  {% endfor %}
  {{/each}}
  `;

  return Handlebars.compile(templateSource)({ input });
}

const args = process.argv.slice(2);

let inputFilePath = "input.json";
if (args.length > 0) {
  inputFilePath = args[0];
}

fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading input file:", err);
    return;
  }

  const input = JSON.parse(data);
  const sqlQuery = generateSQLQueryTemplate(input);

  fs.writeFile("output.sql", sqlQuery, "utf8", (err) => {
    if (err) {
      console.error("Error writing output file:", err);
      return;
    }
    console.log("Output saved to output.sql");
  });
});
