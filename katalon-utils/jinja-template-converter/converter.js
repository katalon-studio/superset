const Handlebars = require("handlebars");
const fs = require("fs");

function formatInput(input) {
  try {
    input.where.forEach((where) => {
      const splitted = where.column.split(".");
      const alias = splitted[0];
      const filterName = splitted[1];
      const join = input.join.find((j) => j.alias === alias);
      if (!join.filterNames) {
        join.filterNames = [];
      }
      join.filterNames.push(filterName);
    });

    // input.select.forEach((select) => {
    //   const column = select.column;
    //   const where = input.where.find((w) => w.column === column);
    //   if (where) {
    //     select.isFilterColumn = true;
    //   } else {
    //     select.isFilterColumn = false;
    //   }
    // });
    // console.log("input", input);
    return input;
  } catch (error) {
    console.log("Input error, please check the input file", error);
  }
}

function generateSQLQueryTemplate(input) {
  const formattedInput = formatInput(input);

  let templateSource = `
  SELECT
  {{#each formattedInput.select}}
    {{#if this.filterName}}
      {% if get_filters('{{{this.filterName}}}', remove_filter=True) %}
        {{{this.column}}} AS {{{this.alias}}}{{#unless @last}},{{/unless}}
      {% else %}
          NULL AS {{{this.alias}}}{{#unless @last}},{{/unless}}
      {% endif %}
    {{else}}
        {{{this.column}}} AS {{{this.alias}}}{{#unless @last}},{{/unless}}
    {{/if}}
  {{/each}}

  FROM {{formattedInput.from.table}} AS {{formattedInput.from.alias}}


  {{#each formattedInput.join}}
  {% if {{#each filterNames}}get_filters('{{{this}}}', remove_filter=True) {{#unless @last}}or {{/unless}}{{/each}}%}
      JOIN {{{this.table}}} AS {{{this.alias}}} ON {{{this.condition}}}
  {% endif %}
  {{/each}}


  WHERE 1=1
  {{#each formattedInput.where}}
  {% for filter in get_filters('{{{this.filterName}}}', remove_filter=True) %}
      {% if filter.get('op') == '{{{this.operator}}}' %}
          AND {{{this.column}}} = \\{{ "'" + filter.get('val')[0] + "'" \}}
      {%- endif -%}
  {% endfor %}
  {{/each}}
  `;

  return Handlebars.compile(templateSource)({ formattedInput });
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
