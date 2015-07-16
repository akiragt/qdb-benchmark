#pragma once

#include <bench/core/test_instance.hpp>

#include <fstream>
#include <sstream>

namespace bench {
namespace report {

class html {
public:
    void add_test(const test_instance& test)
    {
        std::ostringstream json;

        json 
            << "{" 
            << "\"id\":\"" << test.info().id << "\","
            << "\"description\":\"" << test.info().description << "\","
            << "\"content_size\":\"" << test.config().content_size << "\","
            << "\"threads\":[";

        for (unsigned i=0; i<test.result.threads.size(); i++)
        {
            auto& thread = test.result.threads[i];

            if (i > 0) json << ",";

            json << "{\"times\":[";

            for (unsigned j=0; j<thread.size(); j++)
            {
                if (j > 0) json << ",";
                json << thread[j].time;
            }

            json << "],\"iterations\":[";

            for (unsigned j=0; j<thread.size(); j++)
            {
                if (j > 0) json << ",";
                json << thread[j].iterations;
            }

            json << "]}";
        }

        json << "]}";

        test_jsons.push_back(json.str());
    }

    void save()
    {
        std::ofstream file;
        file.open("results.jsonp");
        file << "results=[";
        for (unsigned i=0; i<test_jsons.size(); i++)
        {
            if (i > 0) file << ",";
            file << test_jsons[i];
        }
        file << "]";
        file.close();
    }

private:
    template<typename TimePoint>
    unsigned long convert_time(TimePoint tp)
    {
        return 0;// tp.time_since_epoch() / std::chrono::milliseconds(1);
    }

    std::vector<std::string> test_jsons;
};

}}